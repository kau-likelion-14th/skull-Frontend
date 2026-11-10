
import React, { useState, useEffect } from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";

import { get, post, put, del, patch } from "../../Api";
import config from "../../Config";

// 카테고리별 색상
const Categories = {
    공부: { backgroundColor: "#E5F8F1", color: "#333" },
    운동: { backgroundColor: "#FFC8BE", color: "#333" },
    동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const DEFAULT_CATEGORY_STYLE = {
    backgroundColor: "#EEEEEE",
    color: "#333",
};

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
};

const Todo = ({
    selectedDate,
    todos,
    isTodoLoading,
    refreshData,
}) => {
    const dateKey = toDateKey(selectedDate);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // 서버 카테고리 목록
    const [serverCategories, setServerCategories] = useState([]);

    // 카테고리 조회 API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await get(config.MAIN.CATEGORIES);

                if (response?.isSuccess === false) {
                    throw new Error(
                        response.message || "카테고리 조회 실패"
                    );
                }

                const result = response?.result ?? [];

                setServerCategories(result);

                console.log("서버 카테고리 목록:", result);
            } catch (error) {
                console.error("카테고리 조회 실패:", error);
                setServerCategories([]);
            }
        };

        fetchCategories();
    }, []);

    // 새 Todo 모달 열기
    const openModal = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    // 기존 Todo 상세 조회 후 수정 모달 열기
    const openEditModal = async (todo) => {
        try {
            const response = await get(
                `/api/todos/${todo.id}`
            );

            if (response?.isSuccess === false) {
                throw new Error(response.message || "Todo 상세 조회 실패");
            }

            const detail = response?.result;

            if (!detail) {
                throw new Error("Todo 상세 정보가 없습니다.");
            }

            let routine = null;

            if (detail.routineEnabled) {
                routine = {
                    startDate: detail.startDate || "",
                    endDate: detail.endDate || "",
                    repeatDays: WEEK_DAYS.indexOf(detail.week),
                };
            }

            setEditingTodo({
                id: detail.todoId,
                text: detail.description,
                category: detail.categoryName,
                completed: todo.completed,
                routine,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Todo 상세 조회 실패:", error);
            alert(error.message || "Todo 정보를 불러오지 못했습니다.");
        }
    };

    // API 요청에 사용할 데이터 생성
    const createPayload = ({ text, category, routine }) => {
        const routineEnabled = Boolean(routine);

        if (!category) {
            throw new Error("카테고리를 선택해주세요.");
        }

        if (routineEnabled) {
            if (
                !routine.startDate ||
                !routine.endDate ||
                routine.repeatDays === null ||
                routine.repeatDays === undefined ||
                routine.repeatDays < 0 ||
                routine.repeatDays > 6
            ) {
                throw new Error(
                    "루틴의 시작 날짜, 종료 날짜, 반복 요일을 모두 선택해주세요."
                );
            }

            if (routine.startDate > routine.endDate) {
                throw new Error(
                    "루틴 종료 날짜는 시작 날짜보다 빠를 수 없습니다."
                );
            }
        }

        return {
            categoryName: category,
            description: text,
            routineEnabled,
            startDate: routineEnabled ? routine.startDate : dateKey,
            endDate: routineEnabled ? routine.endDate : dateKey,
            week: routineEnabled
                ? WEEK_DAYS[routine.repeatDays]
                : null,
        };
    };

    // Todo 생성 및 수정
    const handleSaveTodo = async ({ text, category, routine }) => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            const payload = createPayload({
                text,
                category,
                routine,
            });

            let response;

            if (editingTodo) {
                // Todo 수정
                response = await put(
                    `/api/todos/${editingTodo.id}`,
                    payload
                );
            } else {
                // Todo 생성
                response = await post(
                    config.MAIN.TODOS,
                    payload,
                    {
                        params: {
                            date: dateKey,
                        },
                    }
                );
            }

            if (response?.isSuccess === false) {
                throw new Error(response.message || "Todo 저장 실패");
            }

            setIsModalOpen(false);
            setEditingTodo(null);

            await refreshData();
        } catch (error) {
            console.error("Todo 저장 실패:", error);
            alert(error.message || "Todo 저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // Todo 삭제
    const handleDeleteTodo = async () => {
        if (!editingTodo || isSaving) return;

        const confirmed = window.confirm("이 Todo를 삭제할까요?");

        if (!confirmed) return;

        setIsSaving(true);

        try {
            const response = await del(
                `/api/todos/${editingTodo.id}/dates/${dateKey}`
            );

            if (response?.isSuccess === false) {
                throw new Error(response.message || "Todo 삭제 실패");
            }

            setIsModalOpen(false);
            setEditingTodo(null);

            await refreshData();
        } catch (error) {
            console.error("Todo 삭제 실패:", error);
            alert(error.message || "Todo 삭제에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // Todo 완료 상태 변경
    const handleTodoCompleted = async (todo) => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            const response = await patch(
                config.MAIN.TOGGLE_COMPLETE(todo.id, dateKey),
                {
                    completed: !todo.completed,
                }
            );

            if (response?.isSuccess === false) {
                throw new Error(response.message || "완료 상태 변경 실패");
            }

            await refreshData();
        } catch (error) {
            console.error("Todo 완료 상태 변경 실패:", error);
            alert(error.message || "완료 상태 변경에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>

                <button
                    className="todo-add"
                    onClick={openModal}
                    disabled={isSaving}
                >
                    +
                </button>
            </div>

            <div className="todo-list">
                {isTodoLoading ? (
                    <div>Todo를 불러오는 중입니다.</div>
                ) : todos.length === 0 ? (
                    <div>등록된 Todo가 없습니다.</div>
                ) : (
                    todos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`todo-item ${todo.completed ? "done" : ""}`}
                            onClick={() => openEditModal(todo)}
                        >
                            <button
                                className={`checkbox ${todo.completed ? "checked" : ""}`}
                                disabled={isSaving}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTodoCompleted(todo);
                                }}
                            />

                            <div className="todo-text">
                                {todo.text}
                            </div>

                            <div
                                className="todo-category"
                                style={
                                    Categories[todo.category] ||
                                    DEFAULT_CATEGORY_STYLE
                                }
                            >
                                {todo.category}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <TodoModal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isSaving) {
                        setIsModalOpen(false);
                    }
                }}
                onSave={handleSaveTodo}
                onDelete={handleDeleteTodo}
                initialTodo={editingTodo}
                categories={serverCategories}
                categoryStyles={Categories}
                isSaving={isSaving}
            />
        </div>
    );
};

export default Todo;


import "../../styles/Todo.css";
import React, { useEffect, useState } from "react";
import RoutineModal from "./RoutineModal";

const DEFAULT_CATEGORY_STYLE = {
    backgroundColor: "#EEEEEE",
    color: "#333",
};

const TodoModal = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialTodo,
    categories = [],
    categoryStyles = {},
    isSaving = false,
}) => {
    const isEditMode = Boolean(initialTodo);

    const [category, setCategory] = useState("");
    const [text, setText] = useState("");
    const [routine, setRoutine] = useState(null);

    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);

    // 모달이 열리거나 서버 카테고리가 도착하면 초기값 설정
    useEffect(() => {
        if (!isOpen) return;

        setCategory(
            initialTodo?.category ||
            categories[0]?.categoryName ||
            ""
        );

        setText(initialTodo?.text || "");
        setRoutine(initialTodo?.routine || null);
    }, [isOpen, initialTodo, categories]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!text.trim() || !category || isSaving) return;

        await onSave({
            text: text.trim(),
            category,
            routine,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-title">
                    {isEditMode ? "할 일 수정하기" : "할 일 추가하기"}
                </div>

                <div className="modal-section">
                    <div className="modal-label">카테고리</div>

                    <div className="modal-categories">
                        {categories.length === 0 ? (
                            <div>
                                등록된 카테고리가 없습니다.
                            </div>
                        ) : (
                            categories.map((c) => {
                                const categoryName = c.categoryName;

                                const categoryStyle =
                                    categoryStyles[categoryName] ||
                                    DEFAULT_CATEGORY_STYLE;

                                return (
                                    <label
                                        key={c.categoryId}
                                        className={`modal-categoryitem ${
                                            category === categoryName
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <span style={categoryStyle}>
                                            {categoryName}
                                        </span>

                                        <input
                                            type="radio"
                                            name="category"
                                            value={categoryName}
                                            checked={category === categoryName}
                                            disabled={isSaving}
                                            onChange={() =>
                                                setCategory(categoryName)
                                            }
                                        />
                                    </label>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">내용</div>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="text-input"
                            placeholder="내용을 입력해주세요"
                            value={text}
                            disabled={isSaving}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="modal-section">
                    <button
                        type="button"
                        className="routine-row"
                        disabled={isSaving}
                        onClick={() => setIsRoutineModalOpen(true)}
                    >
                        <div className="routine-label">
                            루틴 등록하기
                        </div>

                        <div className="routine-button">
                            {"›"}
                        </div>
                    </button>

                    {routine && (
                        <div className="routine-summary">
                            루틴이 등록되어 있습니다.
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        className={`leftbutton ${
                            isEditMode ? "" : "disabled"
                        }`}
                        onClick={onDelete}
                        disabled={!isEditMode || isSaving}
                    >
                        삭제
                    </button>

                    <button
                        className={`rightbutton ${
                            text.trim() && category ? "" : "disabled"
                        }`}
                        onClick={handleSave}
                        disabled={!text.trim() || !category || isSaving}
                    >
                        {isSaving ? "저장 중..." : "저장"}
                    </button>
                </div>

                <RoutineModal
                    isOpen={isRoutineModalOpen}
                    initialRoutine={routine}
                    onClose={() => setIsRoutineModalOpen(false)}
                    onSave={(newRoutine) => {
                        setRoutine(newRoutine);
                        setIsRoutineModalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default TodoModal;

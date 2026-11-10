
import React, { useState, useEffect, useCallback } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import { get } from "../../Api";
import config from "../../Config";
import "../../styles/MainPage.css";

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
};

const MainPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());

    const [todos, setTodos] = useState([]);
    const [calendarByDate, setCalendarByDate] = useState({});

    const [isTodoLoading, setIsTodoLoading] = useState(false);

    // 선택한 날짜의 Todo 조회
    const fetchTodos = useCallback(async () => {
        setIsTodoLoading(true);

        try {
            const date = toDateKey(selectedDate);

            const response = await get(config.MAIN.TODOS, {
                date,
            });

            if (response?.isSuccess === false) {
                throw new Error(response.message || "Todo 조회 실패");
            }

            const result = response?.result ?? [];

            const mappedTodos = result.map((todo) => ({
                id: todo.todoId,
                text: todo.description,
                category: todo.categoryName,
                completed: todo.completed,
            }));

            setTodos(mappedTodos);
        } catch (error) {
            console.error("Todo 조회 실패:", error);
            setTodos([]);
        } finally {
            setIsTodoLoading(false);
        }
    }, [selectedDate]);

    // 선택한 달의 캘린더 조회
    const fetchCalendar = useCallback(async () => {
        try {
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth() + 1;

            const response = await get(config.MAIN.CALENDAR, {
                year,
                month,
            });

            if (response?.isSuccess === false) {
                throw new Error(response.message || "캘린더 조회 실패");
            }

            const days = response?.result?.days ?? [];
            const remainingByDate = {};

            days.forEach((day) => {
                remainingByDate[day.date] = {
                    remaining: Number(day.remaining),
                    hasTodo: day.hasTodo,
                };
            });

            setCalendarByDate(remainingByDate);
        } catch (error) {
            console.error("캘린더 조회 실패:", error);
            setCalendarByDate({});
        }
    }, [viewDate]);

    // 날짜가 바뀌면 해당 날짜의 Todo 조회
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // 월이 바뀌면 캘린더 조회
    useEffect(() => {
        fetchCalendar();
    }, [fetchCalendar]);

    // Todo 변경 후 목록과 캘린더 새로고침
    const refreshData = useCallback(async () => {
        await Promise.all([
            fetchTodos(),
            fetchCalendar(),
        ]);
    }, [fetchTodos, fetchCalendar]);

    return (
        <div className="mainpage-container">
            <CustomCalendar
                initialDate={selectedDate}
                viewDate={viewDate}
                onViewDateChange={setViewDate}
                onDateChange={setSelectedDate}
                calendarByDate={calendarByDate}
            />

            <Todo
                selectedDate={selectedDate}
                todos={todos}
                isTodoLoading={isTodoLoading}
                refreshData={refreshData}
            />
        </div>
    );
};

export default MainPage;

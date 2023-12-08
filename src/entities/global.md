User
    email
    name
    password
    isActive
Habit
    title
    createdAt
    numbersOfWeek
    
    dayHabitsConcludes DayHabitsConcludes[]
    weekDays HabitWeekDay[]

HabitWeekDay
    habit_id
    weekDay

Day
    date

    dayHabitsConcludes DayHabitsConcludes[]

DayHabitsConcludes
    habit_id Habit.id
    day_id   Day.id

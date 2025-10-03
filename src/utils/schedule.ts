export function isWorkingDay(date: Date): boolean {
    // 0 = Domingo, 1 = Lunes ... 6 = Sábado
    const day = date.getDay();

    const restDays = [3, 4]; // Martes y Miércoles

    return !restDays.includes(day);
}

export function getWorkHours(date: Date): { start: string; end: string } | null {
    const day = date.getDay();

    if (!isWorkingDay(date)) return null;

    if (day >= 1 && day <= 4) {
        // Lunes a Jueves
        return { start: "17:00", end: "00:00" };
    } else if (day === 5 || day === 6) {
        // Viernes o Sábado
        return { start: "17:00", end: "01:00" };
    } else if (day === 0) {
        // Domingo
        return { start: "15:00", end: "00:00" };
    }

    return null;
}

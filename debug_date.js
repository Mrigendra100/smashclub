
const selectedSlots = [
    {
        date: "2025-12-03T00:00:00.000Z", // Assumption: ISO string from backend
        slot: { startTime: "05:00" }
    },
    {
        date: "2025-12-03", // Assumption: YYYY-MM-DD string
        slot: { startTime: "05:00" }
    }
];

selectedSlots.forEach((s, i) => {
    console.log(`--- Slot ${i} ---`);
    console.log(`Input Date: ${s.date}`);
    console.log(`Input Time: ${s.slot.startTime}`);

    const startTime = new Date(s.date);
    console.log(`Initial Date Object: ${startTime.toString()}`);

    const [hours, minutes] = s.slot.startTime.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes || '0'), 0, 0);
    console.log(`After setHours: ${startTime.toString()}`);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    console.log(`EndTime Object: ${endTime.toString()}`);

    console.log(`ISO Start: ${startTime.toISOString()}`);
    console.log(`ISO End: ${endTime.toISOString()}`);
});

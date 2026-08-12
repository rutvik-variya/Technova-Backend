export const orderTimelineResponse = (
    history: any[]
) => {
    return history.map((item) => ({
        id: item.id,
        fromStatus: item.fromStatus,
        toStatus: item.toStatus,
        note: item.note,
        changedBy: item.changedBy
            ? {
                id:
                    item.changedBy.id,

                name:
                    item.changedBy.name,
            }
            : null,
        createdAt: item.createdAt,
    }));
};
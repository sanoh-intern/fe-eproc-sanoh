const fetchAnnouncement = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 25 }, (_, i) => ({
        id: `announcement-${i + 1}`,
        title: `Announcement ${i + 1}`,
        content: `Content for Announcement ${i + 1}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
    }))
}

export default fetchAnnouncement;
'use server';

const token = "8206817533:AAHBKjojzX10a8RRs0WUKt_hJdyeIl7hvK8";

export async function sendTelegramNotification(chatId: string, doctorName: string, date: string, day: string) {
    if (!chatId) {
        console.error("No Chat ID provided for Telegram notification.");
        return { success: false, error: "No Chat ID provided" };
    }

    const text = `✅ Your appointment has been successfully booked!\n\n👨‍⚕️ *Doctor:* ${doctorName}\n📅 *Date:* ${date}\n🗓️ *Day:* ${day}`;

    console.log(`Sending Telegram notification to Chat ID: ${chatId}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (!data.ok) {
            console.error("Telegram API Error:", data);
            return { success: false, error: data.description };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send Telegram notification:", error);
        return { success: false, error: "Network error" };
    }
}

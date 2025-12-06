

const eventSubPromise = new Promise((resolve, reject) => {
    const EVENT_SUB_SOCKET = new WebSocket('wss://eventsub.wss.twitch.tv/ws');
    const TIMEOUT = setTimeout(() => {
        EVENT_SUB_SOCKET.close();
        reject("Timed out while registering");
    }, 5000)
    EVENT_SUB_SOCKET.onmessage = async (data) => {
        if(data && data.data){
            const parsed = JSON.parse(data.data);
            console.log(parsed);
            if(parsed.metadata.message_type === 'session_reconnect'){
                const newUrl = parsed.payload.session.reconnect_url;
                // TODO 
            }else if(parsed.metadata.message_type === 'session_welcome') {
                clearTimeout(TIMEOUT);
                const session_id = parsed.payload.session.id;
                const broadcaster_user_id = "BROADCASTER_ID";

                // subscription helper function
                const SUBSCRIPTIONS = [
                    {
                        type: "channel.chat.message",
                        version: "1",
                        condition: {broadcaster_user_id}
                    }
                ];
                const subscribeToEvent = async (type, version, condition) => {
                    const response = await fetch(
                    'https://api.twitch.tv/helix/eventsub/subscriptions',
                    {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${TWITCH_USER_TOKEN}`,
                            'Client-ID': TWITCH_CLIENT_ID,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            type,
                            version,
                            condition,
                            transport: {
                                method: "websocket",
                                session_id
                            }
                        })
                    });
                    const json = await response.json();
                    if(response.status >= 200 && response.status < 300){
                        return json;
                    }else{
                        reject(`Error while subscribing to ${type} - ${response.status} - ${json.message}`);
                    }
                };
                // subscribe to chat messages
                for(const subscription of SUBSCRIPTIONS){
                    await subscribeToEvent(
                        subscription.type,
                        subscription.version,
                        subscription.condition
                    );
                }
                resolve(EVENT_SUB_SOCKET);
            }
        }
    }
});

eventSubPromise.then((socket) => {
    console.log("connected!");
}).catch((err) => {
    console.error(err);
})
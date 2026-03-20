const WebSocket = require('ws');
const child_process = require('child_process');

const PORT = 9999;
const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`[CCTV RELAY] WebSocket Server started on ws://localhost:${PORT}`);
    console.log(`[CCTV RELAY] Spawning FFmpeg to capture RTSP...`);
});

const ffmpegArgs = [
    '-loglevel', 'error',
    '-rtsp_transport', 'tcp',
    '-i', 'rtsp://172.30.1.44:554/user=bumcctv&password=tjdqja21@@&channel=3&stream=1.sdp?',
    '-vf', "fps=30, format=gray, eq=contrast=2.5:brightness=-0.05, negate, format=monob, format=rgb24, lutrgb='r=0:g=val:b=0', scale=1280:-1:flags=neighbor",
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-b:v', '1000k',
    '-bf', '0',
    '-'
];

const ffmpeg = child_process.spawn('ffmpeg', ffmpegArgs);

ffmpeg.stdout.on('data', (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
});

ffmpeg.stderr.on('data', (data) => {
    console.error(`[FFmpeg ERR] ${data}`);
});

ffmpeg.on('close', (code) => {
    console.log(`[FFmpeg] Process closed with code ${code}`);
});

process.on('SIGINT', () => {
    ffmpeg.kill('SIGINT');
    process.exit();
});

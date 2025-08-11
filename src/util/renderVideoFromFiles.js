const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = async function renderVideoFromFiles(
  filesPath,
  fps = 30,
  output = "video.mp4"
) {
  const screenshotExt = "jpg";
  const input = `${filesPath}/screenshot_%06d.${screenshotExt}`;

  return new Promise((resolve, reject) => {
    try {
      const process = ffmpeg();
      process.addInput(input);
      process.fpsInput(fps);
      process.fps(fps);
      
      // High quality settings
      process.videoBitrate(50000); // Increased from 10000 to 50000 kbps
      process.videoCodec('libx264'); // Explicitly set codec
      
      process.output(output);
      process.outputOptions([
        '-pix_fmt yuv420p',
        '-crf 18', // Constant Rate Factor: 18 = very high quality (0-51 scale, lower = better)
        '-preset slow', // Slower encoding for better quality
        '-profile:v high', // H.264 high profile for better compression efficiency
        '-movflags +faststart' // Optimize for web streaming
      ]);
      
      process.on("end", () => {
        resolve(output);
      });

      process.run();
    } catch (e) {
      reject(e);
    }
  });
};

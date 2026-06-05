package cn.edu.zju.chen.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class EdgeTtsService {

    private final Path audioDir;
    private final String voice;
    private final String edgeTtsPath;

    public EdgeTtsService(
            @Value("${AUDIO_DIR:./audio}") String audioDir,
            @Value("${EDGE_TTS_VOICE:zh-CN-XiaoxiaoNeural}") String voice,
            @Value("${EDGE_TTS_PATH:}") String edgeTtsPath
    ) {
        this.audioDir = Path.of(audioDir);
        this.voice = voice;
        this.edgeTtsPath = resolveEdgeTtsPath(edgeTtsPath);
        log.info("Edge TTS 路径: {}", this.edgeTtsPath);
    }

    private String resolveEdgeTtsPath(String configured) {
        if (configured != null && !configured.isBlank()) {
            return configured;
        }

        String home = System.getProperty("user.home");
        List<String> candidates = new java.util.ArrayList<>();

        // macOS — pip3 --user
        candidates.add(home + "/Library/Python/3.13/bin/edge-tts");
        candidates.add(home + "/Library/Python/3.12/bin/edge-tts");
        candidates.add(home + "/Library/Python/3.11/bin/edge-tts");
        // macOS — Homebrew / pipx
        candidates.add("/opt/homebrew/bin/edge-tts");
        candidates.add("/usr/local/bin/edge-tts");
        candidates.add(home + "/.local/bin/edge-tts");

        // Windows — pip3 --user
        String appData = System.getenv("APPDATA");
        if (appData != null) {
            candidates.add(appData + "\\Python\\Python313\\Scripts\\edge-tts.exe");
            candidates.add(appData + "\\Python\\Python312\\Scripts\\edge-tts.exe");
            candidates.add(appData + "\\Python\\Python311\\Scripts\\edge-tts.exe");
        }
        // Windows — pipx
        candidates.add(home + "\\.local\\bin\\edge-tts.exe");

        // Linux — pip3 / pipx
        candidates.add(home + "/.local/bin/edge-tts");

        for (String candidate : candidates) {
            if (Files.exists(Path.of(candidate))) {
                return candidate;
            }
        }
        return "edge-tts"; // fallback to PATH
    }

    public Path generateAudio(String taskId, String text) {
        try {
            Files.createDirectories(audioDir);
            Path outputPath = audioDir.resolve(safeFileName(taskId) + ".mp3");

            // 将文本写入临时文件，避免 --text 参数长度限制
            Path tmpFile = Files.createTempFile("tts_", ".txt");
            Files.writeString(tmpFile, text);

            try {
                ProcessBuilder processBuilder = new ProcessBuilder(
                        edgeTtsPath,
                        "--voice", voice,
                        "--file", tmpFile.toString(),
                        "--write-media", outputPath.toString()
                );
                processBuilder.redirectErrorStream(true);

                Process process = processBuilder.start();
                boolean finished = process.waitFor(120, TimeUnit.SECONDS);

                if (!finished) {
                    process.destroyForcibly();
                    throw new IllegalStateException("Edge TTS 超时（120秒）");
                }

                String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                int exitCode = process.exitValue();

                if (exitCode != 0) {
                    throw new IllegalStateException("Edge TTS failed: " + output);
                }

                log.info("语音合成完成: {}", outputPath);
                return outputPath;
            } finally {
                Files.deleteIfExists(tmpFile);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Failed to generate audio file.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Edge TTS process was interrupted.", e);
        }
    }

    public Resource getAudioResource(String taskId) {
        Path audioPath = audioDir.resolve(safeFileName(taskId) + ".mp3");

        if (!Files.exists(audioPath)) {
            throw new IllegalStateException("Audio file not found for taskId: " + taskId);
        }

        return new FileSystemResource(audioPath);
    }

    private String safeFileName(String value) {
        if (value == null || value.isBlank()) {
            return "unknown";
        }

        return value.replaceAll("[^a-zA-Z0-9_-]", "_");
    }
}
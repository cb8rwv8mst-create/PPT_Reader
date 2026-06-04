package cn.edu.zju.chen.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class EdgeTtsService {

    private final Path audioDir;
    private final String voice;

    public EdgeTtsService(
            @Value("${AUDIO_DIR:./audio}") String audioDir,
            @Value("${EDGE_TTS_VOICE:zh-CN-XiaoxiaoNeural}") String voice
    ) {
        this.audioDir = Path.of(audioDir);
        this.voice = voice;
    }

    public Path generateAudio(String taskId, String text) {
        try {
            Files.createDirectories(audioDir);

            Path outputPath = audioDir.resolve(safeFileName(taskId) + ".mp3");

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "edge-tts",
                    "--voice", voice,
                    "--text", text,
                    "--write-media", outputPath.toString()
            );

            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new IllegalStateException("Edge TTS failed: " + output);
            }

            return outputPath;
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
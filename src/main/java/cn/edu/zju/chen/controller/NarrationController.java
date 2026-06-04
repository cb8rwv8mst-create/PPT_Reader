package cn.edu.zju.chen.controller;

import cn.edu.zju.chen.dto.NarrateRequest;
import cn.edu.zju.chen.dto.NarrateResponse;
import cn.edu.zju.chen.service.DeepSeekService;
import cn.edu.zju.chen.service.EdgeTtsService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ppt")
@CrossOrigin(origins = "http://localhost:5173")
public class NarrationController {

    private final DeepSeekService deepSeekService;
    private final EdgeTtsService edgeTtsService;

    public NarrationController(
            DeepSeekService deepSeekService,
            EdgeTtsService edgeTtsService
    ) {
        this.deepSeekService = deepSeekService;
        this.edgeTtsService = edgeTtsService;
    }

    @PostMapping("/{id}/narrate")
    public NarrateResponse narrate(
            @PathVariable String id,
            @RequestBody NarrateRequest request
    ) {
        NarrateResponse response = deepSeekService.generateNarration(request.slides());

        edgeTtsService.generateAudio(id, response.fullScript());

        return response;
    }

    @GetMapping(value = "/{id}/audio", produces = "audio/mpeg")
    public ResponseEntity<Resource> getAudio(@PathVariable String id) {
        Resource audioResource = edgeTtsService.getAudioResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(id + ".mp3")
                                .build()
                                .toString()
                )
                .body(audioResource);
    }
}

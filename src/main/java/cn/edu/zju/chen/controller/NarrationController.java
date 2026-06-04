package cn.edu.zju.chen.controller;

import cn.edu.zju.chen.dto.NarrateRequest;
import cn.edu.zju.chen.dto.NarrateResponse;
import cn.edu.zju.chen.service.DeepSeekService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ppt")
@CrossOrigin(origins = "http://localhost:5173")
public class NarrationController {

    private final DeepSeekService deepSeekService;

    public NarrationController(DeepSeekService deepSeekService) {
        this.deepSeekService = deepSeekService;
    }

    @PostMapping("/{id}/narrate")
    public NarrateResponse narrate(
            @PathVariable String id,
            @RequestBody NarrateRequest request
    ) {
        return deepSeekService.generateNarration(request.slides());
    }
}

package cn.edu.zju.chen.service;

import cn.edu.zju.chen.model.PptTask;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class PptTaskStore {

    private final ConcurrentHashMap<String, PptTask> store = new ConcurrentHashMap<>();

    public void save(PptTask task) {
        store.put(task.getId(), task);
    }

    public PptTask findById(String id) {
        PptTask task = store.get(id);
        if (task == null) {
            throw new IllegalArgumentException("任务不存在: " + id);
        }
        return task;
    }
}

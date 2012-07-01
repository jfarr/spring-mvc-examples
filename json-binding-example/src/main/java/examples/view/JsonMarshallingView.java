package examples.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.web.servlet.View;

@SuppressWarnings("rawtypes")
public class JsonMarshallingView implements View {

    private ObjectMapper objectMapper;
    private String modelName;
    
    public void setObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    @Override
    public void render(Map model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        objectMapper.writeValue(response.getOutputStream(), model.get(modelName));
    }
}

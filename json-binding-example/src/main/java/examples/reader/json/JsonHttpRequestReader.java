package examples.reader.json;

import javax.servlet.http.HttpServletRequest;

import org.codehaus.jackson.map.ObjectMapper;

import examples.reader.HttpRequestReader;

public class JsonHttpRequestReader<T> implements HttpRequestReader<T> {

    private ObjectMapper objectMapper;

    public void setObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public T read(Class<? extends T> clazz, HttpServletRequest request) throws Exception {
        return objectMapper.readValue(request.getInputStream(), objectMapper.getTypeFactory().constructType(clazz));
    }
}

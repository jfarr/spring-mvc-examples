package examples.reader;

import javax.servlet.http.HttpServletRequest;

public interface HttpRequestReader<T> {

    T read(Class<? extends T> clazz, HttpServletRequest request) throws Exception;
}

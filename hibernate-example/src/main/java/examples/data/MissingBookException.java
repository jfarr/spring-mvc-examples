package examples.data;

@SuppressWarnings("serial")
public class MissingBookException extends Exception {

    public MissingBookException() {
    }

    public MissingBookException(String message, Throwable cause) {
        super(message, cause);
    }

    public MissingBookException(String message) {
        super(message);
    }

    public MissingBookException(Throwable cause) {
        super(cause);
    }
}

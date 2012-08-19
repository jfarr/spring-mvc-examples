package examples.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Paginator {

    private int maxResults;

    @Value("${defaultMaxResults}")
    public void setMaxResults(int maxResults) {
        this.maxResults = maxResults;
    }
    
    public int getFirstResult(Integer firstResult) {
        return firstResult == null ? 0 : firstResult;
    }
    
    public int getMaxResults(Integer maxResults) {
        return (maxResults == null) ? this.maxResults : Math.min(maxResults, this.maxResults);
    }
    
    public Integer getNextResult(int firstResult, int maxResults, long total) {
        int nextResult = firstResult + maxResults;
        return nextResult < total ? nextResult : null;
    }
    
    public Integer getPreviousResult(int firstResult, int maxResults) {
        int previousResult = firstResult - maxResults;
        return previousResult >= 0 ? previousResult : null;
    }
    
    public Integer getStartResult(long firstResult) {
        return firstResult == 0 ? null : 0;
    }
    
    public Integer getLastResult(int firstResult, int maxResults, long total) {
        int lastResult = (int) (total - total % maxResults);
        return firstResult == lastResult ? null : lastResult;
    }
}

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
    
    public Page getPage(Integer firstResult, Integer maxResults, long total) {
        maxResults = getMaxResults(maxResults);
        firstResult = getFirstResult(firstResult, maxResults, total);
        return new Page(
                firstResult,
                maxResults,
                total,
                getNextResult(firstResult, maxResults, total),
                getPreviousResult(firstResult, maxResults),
                getStartResult(firstResult),
                getLastResult(firstResult, maxResults, total)
                );
    }
    
    private int getFirstResult(Integer firstResult, int maxResults, long total) {
        return firstResult == null ? 0 : (firstResult < total ? firstResult : firstResult - maxResults);
    }
    
    private int getMaxResults(Integer maxResults) {
        return maxResults == null ? this.maxResults : Math.min(maxResults, this.maxResults);
    }
    
    private Integer getNextResult(int firstResult, int maxResults, long total) {
        int nextResult = firstResult + maxResults;
        return nextResult < total ? nextResult : null;
    }
    
    private Integer getPreviousResult(int firstResult, int maxResults) {
        int previousResult = firstResult - maxResults;
        return previousResult >= 0 ? previousResult : null;
    }
    
    private Integer getStartResult(long firstResult) {
        return firstResult == 0 ? null : 0;
    }
    
    private Integer getLastResult(int firstResult, int maxResults, long total) {
        long remaining = total % maxResults;
        int lastResult = (int) (remaining == 0 ? (total - maxResults) : (total - remaining));
        return firstResult == lastResult ? null : lastResult;
    }
}

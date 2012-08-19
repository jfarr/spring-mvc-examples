package examples.controller;

public class Page {

    private final int firstResult;
    private final int maxResults;
    private final long total;
    private final Integer nextResult;
    private final Integer prevResult;
    private final Integer startResult;
    private final Integer lastResult;

    public Page(int firstResult, int maxResults, long total, Integer nextResult, Integer prevResult,
            Integer startResult, Integer lastResult) {
        
        this.firstResult = firstResult;
        this.maxResults = maxResults;
        this.total = total;
        this.nextResult = nextResult;
        this.prevResult = prevResult;
        this.startResult = startResult;
        this.lastResult = lastResult;
    }

    public int getFirstResult() {
        return firstResult;
    }

    public int getMaxResults() {
        return maxResults;
    }

    public long getTotal() {
        return total;
    }

    public Integer getNextResult() {
        return nextResult;
    }

    public Integer getPrevResult() {
        return prevResult;
    }

    public Integer getStartResult() {
        return startResult;
    }

    public Integer getLastResult() {
        return lastResult;
    }
}

mvn exec:java -Dexec.mainClass="org.hsqldb.util.SqlTool" -Dexec.args='--sql "shutdown;" --inlineRc url=jdbc:hsqldb:hsql://localhost,user=sa,password='

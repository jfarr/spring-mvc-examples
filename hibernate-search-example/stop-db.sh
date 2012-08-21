mvn exec:java -Dexec.mainClass="org.hsqldb.cmdline.SqlTool" -Dexec.args='--sql "shutdown;" --inlineRc url=jdbc:hsqldb:hsql://localhost,user=sa,password='

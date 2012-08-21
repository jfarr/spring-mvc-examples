mvn exec:java -Dexec.mainClass="org.hsqldb.cmdline.SqlTool" -Dexec.args='--inlineRc url=jdbc:hsqldb:hsql://localhost,user=sa,password=,charset=UTF-8 src/test/scripts/books.sql'

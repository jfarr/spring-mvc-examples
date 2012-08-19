mvn exec:java -Dexec.mainClass="org.hsqldb.util.SqlTool" -Dexec.args='--inlineRc url=jdbc:hsqldb:hsql://localhost,user=sa,password= src/test/scripts/books.sql '

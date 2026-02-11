@echo off
rem set NODE_OPTIONS=--openssl-legacy-provider 
call npm run build
cd %~dp0
"C:\Program Files (x86)\WinSCP\winscp" /script=winscp_script.txt

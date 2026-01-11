Set objShell = CreateObject("WScript.Shell")
objShell.Run Chr(34) & CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\index.html" & Chr(34), 1, False

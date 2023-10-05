//Editor related logic
editor = ace.edit("input");
function setupAceEdit(version, theme)
{
	editor.setTheme("ace/theme/" + theme);
	editor.$blockScrolling = Infinity;
	editor.getSession().setMode("ace/mode/" + version);
	editor.setShowPrintMargin(false);
}

// Code Sharing
var lzstring = document.createElement('script');
lzstring.type = 'text/javascript';
lzstring.src = '/utils/lz-string-1.4.4/libs/lz-string.js';
lzstring.src = '/utils/lz-string/lz-string.min.js';
document.head.appendChild(lzstring);

lzstring.addEventListener("load", () => {
	function updateUrl()
	{
    var newCode = editor.getValue();
    compressed = "#" + LZString.compressToEncodedURIComponent(newCode);
    history.replaceState(null, '', compressed);
	}
	editor.addEventListener("input", updateUrl);

	var encodedCode = window.location.hash;
  if (encodedCode)
  {
    var decompressedCode = LZString.decompressFromEncodedURIComponent(encodedCode.substring(1));
    editor.setValue(decompressedCode);
  }
  else
  {
    editor.setValue(document.getElementById("sample_HW").textContent,1);
  }

}, false);

// Example selection
function example(el)
{
	editor.setValue(document.getElementById("sample_" + el.value).textContent,1);
	el.value = "0";
}



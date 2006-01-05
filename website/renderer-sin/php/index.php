<?php

$ENGINE_VERSION	= '$Id$';

require_once("sin/autodeploy.inc");
if (is_file("sin/declarations.local.inc")) {
	require_once("sin/declarations.local.inc");
} else {
	require_once("sin/declarations.inc");
}
require_once("sin/functions.inc");

if ($PROCESSOR_CLASS == "") {
	print("Processor class missing.");
	exit;
}

require_once($PROCESSOR_CLASS); 

header("Content-Type: text/html;");

if (debugMode()) print "<HTML><BODY><H2>Debug Mode</H2>";

// Initialize path to the requested page.
$page = chopTrailingSlash( $_SERVER["PATH_INFO"] );

// Redirect to index.xml if page is a directory
if (is_dir( $GLOBALS["PAGES_REAL_DIR"] . $page ))
{
	if (debugMode())
	{
		print("<h3>Page is a directory" . $page . "</h3>");
		print("Redirecting to location: "
	                . chopTrailingSlash($BASE_URL) . "/" . $ENGINE_SCRIPT
	                . chopTrailingSlash($page) . "/index.xml");
		exit();
	}
	else
	{
		header("Location: "
	                . chopTrailingSlash($BASE_URL) . "/" . $ENGINE_SCRIPT
	                . chopTrailingSlash($page) . "/index.xml");
		exit();
	}
}

// Initialize the XSLT processor class.
$processor = new sin_XSLTProcessor();
$processor->initialize();

// Security checkpoint
if (isPageSecure($page, $processor)==FALSE)
{
	if (debugMode()) print("<h3>Page URL is insecure: " . $page);
	$page = "/engine_pages/securityWarning.xml";
}

// Redirect if page is a directory
if (is_file( $GLOBALS["PAGES_REAL_DIR"] . $page )==FALSE)
{
	if (debugMode()) print("<h3>Page does not exist: " . $page . "</h3>");
	$page = "/engine_pages/pageDoesNotExist.xml";
}

// Strip the query part of the URL from the lang parameter (if any)
// and create a query string for URL rewriting purposes.
$queryString = "";
foreach ($_GET as $key => $value)
	if ($key != 'lang')
	{
		if ($queryString != "") $queryString = $queryString . "&";
		$queryString = $queryString . urlencode($key) . "=" . urlencode($value);
	}

// Add required variables for the XSLT stylesheets.
$processor->addParam("engineBaseURL",   $BASE_URL );
$processor->addParam("engineScriptURL", $BASE_URL . "/" . $ENGINE_SCRIPT );
$processor->addParam("pageURL",         $BASE_URL . "/" . $ENGINE_SCRIPT . $page);
$processor->addParam("realPageURL",     $REAL_PAGES_URL . dirOnly( $page ))	;
$processor->addParam("docsBaseURL",     $REAL_PAGES_URL );
$processor->addFileUrlParam("sitemapURL",   $PAGES_REAL_DIR . "/sitemap.xml" );
$processor->addFileUrlParam("localPageDir", $PAGES_REAL_DIR . dirOnly( $page ));
$processor->addParam("queryString",     $queryString );

$processor->addParam("lastUpdate",      date ("d-m-Y H:i:s", filemtime( $PAGES_REAL_DIR . $page )));   
$processor->addParam("currentDate",     date ("Y-m-d", time()));   
$processor->addParam("engineVersion",   $ENGINE_VERSION);

if (isset($_GET['lang'])) {
    $processor->addParam("requestedLang", $_GET['lang']);
}

// Add any HTTP GET params that have been passed to the script.
foreach ($_GET as $key => $value)
	if ($key != 'lang')
		$processor->addParam($key, $value);
        
// Load the first five lines of the input file and check if there is directive
// on which stylesheet should be applied. Default stylesheet is used if no
// directive is found. We're using regexp to find the directive, because it 
// would be too slow to parse the XML file.
$stylesheet = "";
$fd 		= fopen ($PAGES_REAL_DIR . $page, "r");
$maxlines 	= 5;
while (!feof ($fd) && $maxlines>=0) {
    $buffer = fgets($fd, 4096);
    $maxlines--;
    // is it the stylesheet directive?
    if (ereg("(<\\?xml-stylesheet[^>]+href=\")([^\"]*)", $buffer, $t))
    {
		$stylesheet = $t[2];
		break;
    }
}
fclose ($fd);

if ($stylesheet == "")
{
	$lines = file($PAGES_REAL_DIR . "/stylemap.txt");
	$clines = count($lines);
	for ($i=0;$i<$clines;$i++)
	{
		$rule = explode( ",", chop( $lines[ $i ] ) );
		if (startsWith($page, $rule[0]))
		{
			$stylesheet = $rule[1];
			break;
		}
	}

	if ($stylesheet == "")
	{
		print "<HTML><BODY>No stylesheet specified.</BODY></HTML>";
		exit();
	}
}

$xmlFile = $PAGES_REAL_DIR . $page;
$xslFile = $XSLT_REAL_DIR . "/" . $stylesheet;

// Invoke the XSLT processor.
$processor->processFiles( $xslFile, $xmlFile );

// Destroy the processor class, it will not be needed anymore.
$processor->destroy();


if (debugMode()) print "</BODY></HTML>";
?>

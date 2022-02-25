//to do list:

// sharp/flat spacing too far
// chord line
// note size can auto change td style min-width
// source file font size adjustable




//new file default
const newFileContents = "/  歌名\n\n$|";
const defaultConfigString = "fc=0,bc=white,bcss=#fa3,lf=0,nf=monospace,ls=36,ns=26";



//string const
const sDemoFile = "內建範例檔";
const sLoadPCFile = "開啟資料夾內檔案";
const sConfirmNotSaved = "編輯內容尚未存檔，確定要繼續？";
const sEdited = " - 已編輯";
//const sEdited = "*";
const sUnnamed = "未命名";
const sDeleteAreYouSure1 = "確定要刪除文件「";
const sDeleteAreYouSure2 = "」嗎？";
const sOverwriteAreYouSure1 = "檔案「";
const sOverwriteAreYouSure2 = "」已存在，確定要取代嗎？";
const sInputSaveFilename = "存檔名稱：";
const sInvalidFileName = "無效檔名";



//definition const
const keySignature = "ks_church_jianpu_";
const versionNumber = "11";
const filenamePrefix = keySignature + versionNumber;
const userFilenameStorageKey = keySignature + "user_filename";  //to save current userFilename
const tempContentsStorageKey = keySignature + "temp_contents";  //to save temp contents
const tempConfigStorageKey = keySignature + "temp_config";  //to save temp config
const notSavedFlagStorageKey = keySignature + "not_saved_flag";  //to save flag
const demoStorageKey = keySignature + "demo";  //to store demo contents

//file area element
const eOpenFileSelect = document.getElementById("openfile");
const eFilenameSpan = document.getElementById("filename");
const eDeleteButton = document.getElementById("b_delete");
const defaultFileSelectElementValue = "file_list_label_option";
const openPCFileOptionValue = "open_pc_file_option";

//main area blocks
const eJPContents = document.getElementById("jp_contents");
const eRenderArea = document.getElementById("render_area");
const eConfigTextArea = document.getElementById("config_text");

//render area element
const eFontColor = document.getElementById("font_color");
const eBackgroundColor = document.getElementById("bg_color");
const eCSSColor = document.getElementById("css_color");
const eLyricsFont = document.getElementById("lyrics_font");
const eLyricsSize = document.getElementById("lyrics_size");
const eNoteFont = document.getElementById("note_font");
const eNoteSize = document.getElementById("note_size");


// note rendering constant
//const lyricsPositionOffset = 24;  //lyrics position fine tuning here
var lyricsPositionOffset = 24;  //lyrics position fine tuning here
const noteBegin1 = '<table class="nt" style="';
const noteFontFamily = 'font-family:';
const noteFontSize = 'font-size:';
const noteBegin2 = '"><tr id="r1"></tr><tr>';
function noteBeginHTML() {
  var s = noteBegin1;
  s += noteFontFamily + noteFont + ";";
  s += noteFontSize + noteSize + "px;";
  s += noteBegin2;
  return s;
}


const preSpan1 = '<!-- prespan --><td colspan="';
const preSpan2 = '">&nbsp;</td>';

//const triplet1 = '<!-- triplet --><td class="cur" colspan="';
//[0]=black, [1]=white
//const triplet2 = ['">3<div class="cur_b"></div></td>','">3<div class="cur_w"></div></td>'];

const slur1 = '<!-- slur --><td class="cur" colspan="';
//[0]=black, [1]=white
const slur2 = ['">&nbsp;<div class="cur_b"></div></td>',
'">&nbsp;<div class="cur_w"></div></td>'];

const tdStart = '<td v="';
const hi0 = '"><div class="hi"></div>';
const hi1 = '"><div class="hi">.</div>';
const note = '<div class="n">';
const sharp1 = '<td><div class="nsharp">&#x266f;</div><div class="hi"></div>';
const sharp2 = '<div class="lo"></div></td>';
const flat1 = '<td><div class="nflat">&#x266d;</div><div class="hi"></div>';
const flat2 = '<div class="lo"></div></td>';
const dot = '<div class="dot">';

//[0]=black, [1]=white
const t4 = ['</div><div class="t4_b"></div>','</div><div class="t4_w"></div>'];
const t8 = ['</div><div class="t8_b"></div>','</div><div class="t8_w"></div>'];
const t16 = ['</div><div class="t16_b"></div>','</div><div class="t16_w"></div>'];

const lo0 = '<div class="lo"></div></td>';
const lo1 = '<div class="lo">.</div></td>';
const noteSpace = '<td class="sp4"></td>';
const t4Space = noteSpace;

//[0]=black, [1]=white
const t8Space = ['<td><div class="hi"></div><div class="n"></div><div class="t8_b"></div><div class="lo"></div></td>',
'<td><div class="hi"></div><div class="n"></div><div class="t8_w"></div><div class="lo"></div></td>'];

//[0]=black, [1]=white
const t16Space = ['<td><div class="hi"></div><div class="n"></div><div class="t16_b"></div><div class="lo"></div></td>',
'<td><div class="hi"></div><div class="n"></div><div class="t16_w"></div><div class="lo"></div></td>'];

const dash = '<td><div class="hi"></div><div class="n">-</div><div class="t4"></div><div class="lo"></div></td>';
const noteEnd = '</tr></table><!--end of note-->';

//[0]=black, [1]=white
//const bar = '<td><div class="bar">|</div></td>';
const bar = ['<td><div class="bar_b"></div></td>',
'<td><div class="bar_w"></div></td>'];
const songEnd = ['<td><div class="double_bar_b"></div></td>',
'<td><div class="double_bar_w"></div></td>'];

const lyricsBegin = '<div class="ly" style="';
const lyricsSpace = '<span class="sp">&nbsp;</span>';
const lyricsEnd = '</div>';

const freetextBegin = '<div class="freetext" style=">';
const freetextEnd = '</div>';





var userFilename = "";  //current user filename
var fullFilename = "";  //= filenamePrefix + userFilename
var jpContents = "";
var notSaved;  //will be true once jp_contents are edited
var existingFilenames = [];  //for checking duplicate filename against user input

var debugWatchValue=0;

//==================
// config
//==================
const configKeyFontColor = "fc";
const configKeyBackgroundColor = "bc";
const configKeyBackgroundCSSColor = "bcss";
const configKeyLyricsFont = "lf";
const configKeyNoteFont = "nf";
const configKeyLyricsSize = "ls";
const configKeyNoteSize = "ns";
const itemSeparator = ",";
var configString = defaultConfigString;

//==========================================================================================
// UI item scenarios
//                     - editor adjustment UI
//                     {
//                       assign property variable
//                       renderOutputDocument() {  buildJPContentsHTML()
//                                                 setAreaGlobalStyles() }
//                       refreshEditorUI()
//                       rebuildConfigString()
//                       markNotSaved()
//                     }
// [config string]              <-              [editor adjustment]
//                              ->
//                     - open a file
//                     - init demo innerHTML
//                     {
//                       assignConfigToVariables()
//                       renderOutputDocument() {  buildJPContentsHTML()
//                                                 setAreaGlobalStyles() }
//                       refreshEditorUI()
//                     }
//
//
//
// jpContents edited:
//                    buildJPContentsHTML()
//==========================================================================================

//for each editor adjustment UI
function renderOutputDocument() {
  calculateLyricsFineTuneOffset();  //set fine-tune before building contents HTML
  buildJPContentsHTML();  //after all styles are set, for width calculation
  setAreaGlobalStyles();
}

//called whenever any config value changes
function rebuildConfigString() {
  configString = 
		configKeyFontColor + "=" + fontColorNum + itemSeparator +
		configKeyBackgroundColor + "=" + backgroundColor + itemSeparator +
		configKeyBackgroundCSSColor + "=" + backgroundCSSColor + itemSeparator +
		configKeyLyricsFont + "=" + lyricsFont + itemSeparator +
		configKeyNoteFont + "=" + noteFont + itemSeparator +
		configKeyLyricsSize + "=" + lyricsSize + itemSeparator +
		configKeyNoteSize + "=" + noteSize;
  eConfigTextArea.value = configString;
}
function markNotSaved() {
  notSaved = true;
  updateUserFilenameDisplayAndLocalStorage();
}

//convert config string into editor values
function assignConfigToVariables() {
  var configItem = configString.split(itemSeparator);
  for (var i=0;i<configItem.length;i++) {
    var key = configItem[i].split("=")[0];
    var value = configItem[i].split("=")[1];
    switch (key) {
      case configKeyFontColor:
        fontColorNum = Number(value);
      break;
      case configKeyBackgroundColor:
        backgroundColor = value;
      break;
      case configKeyBackgroundCSSColor:
        backgroundCSSColor = value;
      break;
      case configKeyLyricsFont:
        lyricsFont = value;
      break;
      case configKeyLyricsSize:
        lyricsSize = value;
        lyricsSizeNum = Number(lyricsSize);
      break;
      case configKeyNoteFont:
        noteFont = value;
      break;
      case configKeyNoteSize:
        noteSize = value;
      break;
      default:
        //ignore non-supported keys
      break;
      }//switch
  }//for
}


//========================================================================
// editor features
//
// different types of how renderFeature() works
// 1. set renderTextArea style at any time: font color, background color, lyrics font, lyrics size
// 2. set variable and take effect inside buildJPContentsHTML(): font color
// 3. modify/append style after buildJPContentsHTML() builds the html: note font
//    (this requires to perform again upon jpContents changing)
// UI.addEventListener(): 
//                        1. set feature variable
//                        2. call rendering to re-build html if necessary
//                        3. call renderFeature to modify style, e.g. note font
//                        4. refresh UI
//                        5. update config string
//========================================================================
//==================================
//called by config and UI
//==================================
function refreshEditorUI() {

  //font color
  switch (fontColorNum) {
    case 0:
      eFontColor.value = "0";
    break;
    case 1:
      eFontColor.value = "1";
    break;
    default:
      eFontColor.value = "0";
    break;
  }//switch


  //background color
  switch (backgroundColor) {
    case "black":
      eBackgroundColor.value = "black";
    break;
    case "white":
      eBackgroundColor.value = "white";
    break;
    default:
      eBackgroundColor.value = "css_color";
    break;
  }//switch

  //CSS text
  eCSSColor.value = backgroundCSSColor;  //this will interfere user input, moved to

  //lyrics and note
  eLyricsFont.value = lyricsFont;
  eNoteFont.value = noteFont;
  eLyricsSize.value = lyricsSize;
  eNoteSize.value = noteSize;
}



//===================================
// setting render area global styles
//===================================

function isCSSColorValid(stringToTest) {
  //Alter the following conditions according to your need.
  if (stringToTest === "") { return false; }
  if (stringToTest === "inherit") { return false; }
  if (stringToTest === "transparent") { return false; }

  var image = document.createElement("img");
  image.style.color = "rgb(0, 0, 0)";
  image.style.color = stringToTest;
  if (image.style.color !== "rgb(0, 0, 0)") { return true; }
  image.style.color = "rgb(255, 255, 255)";
  image.style.color = stringToTest;
  return image.style.color !== "rgb(255, 255, 255)";
}

function setAreaGlobalStyles() {
  //lyrics size
  eRenderArea.style.fontSize = lyricsSize + "px";

  //lyrics font
  switch (lyricsFont) {
  case "0":
    eRenderArea.style.fontFamily = '"標楷體","BiauKai","全字庫正楷體", "TW-Kai", STKaiti, DFKai-SB;';
  break;
  case "1":
    eRenderArea.style.fontFamily = 
      'PingFang, STHeiti, "Microsoft JhengHei";';
  break;
  case "2":
    eRenderArea.style.fontFamily = 
      'STSong, "LiSong Pro", "Apple LiSung Light",PMingLiU;';
  break;
  default:
  break;
  }//switch

  //font color global part
  eRenderArea.style.color = "black";
  if (fontColorNum === 1) {
    eRenderArea.style.color = "white";
  }

  // if sel=css_color -> renderBackgroundCSSColor(css value);
  // else (black or white) -> renderBackgroundColor(bg value);
  if (backgroundColor === "css_color") {
    if (isCSSColorValid(backgroundCSSColor)) {
      eRenderArea.style.backgroundColor = backgroundCSSColor;
    }
    else {
      //invalid css color, set color to gray
      eRenderArea.style.backgroundColor = "gray";
    }
  }
  else {
    eRenderArea.style.backgroundColor = backgroundColor;
  }

}


// +-----------------------------------------
// |   render area (position:absolute)
// |
// | margin-left  +---------------
// |              |  table.nt
// |              |<td> |  <td> |
// |              |  1  |   2   |
// |              +-----+-------+---
// |                  ^ .nt {margin-bottom}
// |                  v
// |                    +----+
// | style="left:px"    |span|
// |                    |.ly |
// |                    +----+




//===============================
// fine-tune lyrics offset
//===============================
//fine tune offset whenever lyrics size is set or changed
function calculateLyricsFineTuneOffset() {
  lyricsPositionOffset = 25 - (lyricsSizeNum-32)/2;
}

//===============================
// lyrics size (global property)
//===============================
var lyricsSize = "36";  //default font-size in span.ly {
var lyricsSizeNum = Number(lyricsSize);
eLyricsSize.addEventListener("change", function (e) {
  lyricsSize = e.target.value;
  lyricsSizeNum = Number(lyricsSize);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//================================
// note size
//================================
var noteSize="26";  //default font-size in table.nt {
eNoteSize.addEventListener("change", function (e) {
  noteSize = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//===============================
// lyrics font (global property)
//===============================
var lyricsFont = "0";
eLyricsFont.addEventListener("change", function (e) {
  lyricsFont = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//================================
// note font
//================================
var noteFont = "monospace";
eNoteFont.addEventListener("change", function (e) {
  noteFont = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//=========================================
// font color (global+inner HTML property)
//=========================================
var fontColorNum = 0;
function assignFontColorVariable(str) {
  switch (str) {
  case "0":
    fontColorNum = 0;  //for indexing in buildJPContentsHTML()
    if (backgroundColor === "black") {
      backgroundColor = "white";  //auto avoid invisible output
    }
  break;
  case "1":
    fontColorNum = 1;  //for indexing in buildJPContentsHTML()
    if (backgroundColor === "white") {
      backgroundColor = "black";  //auto avoid invisible output
    }
  break;
  default:
    fontColorNum = 0;  //for indexing in buildJPContentsHTML()
  break;
  }//switch
}
eFontColor.addEventListener("change", function (e) {
  assignFontColorVariable(e.target.value);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);


//==================
// background color
//==================
var backgroundColor = "white";
eBackgroundColor.addEventListener("change", function (e) {
  backgroundColor = e.target.value;

  //auto avoid invisible output
  switch (backgroundColor) {
    case "black":
      if (fontColorNum === 0) {fontColorNum=1;}
    break;
    case "white":
      if (fontColorNum === 1) {fontColorNum=0;}
    break;
  }

  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//======================
// background CSS color
//======================
var backgroundCSSColor = "";
eCSSColor.addEventListener("input", function (e) {
  backgroundCSSColor = e.target.value;  //="#f8a" or "rgb(128,120,20)" or "red"
  renderOutputDocument();
  //refreshEditorUI();  //refresh is not necessary and will interfere user input cursor
  rebuildConfigString();
  markNotSaved();
}, false);


//===================================
//    render function
//===================================

function buildJPContentsHTML() {
  var s=" ";
  var octave = 0;
  var underline = 0;
  var t = t4[fontColorNum];

  var mode = "";  //init mode
  var iTD = 0;  //<td> index for adding slur
  var preSpan = 0;  //init
  var row1;


  var tdIsNote = [];  //1 if <td> is a note where a lyrics character can be allocated
                      //0 if <td> exists, but is not a note, maybe space or bar
  var tdCenterPosition = [];
  var iLyricsChar = 0;  //index of lyrics characters
  var lastLyricCenterPosition = -lyricsSizeNum;  //the last lyrics character's position


  eRenderArea.innerHTML = "";  //clear output window

  //for debug
  if (0) {
    if (!jpContents) {
      alert("jpContents = " + jpContents);
      return;
    }
  }

  for (var i=0;i<jpContents.length;i++) {
    //const c=srcString[i];
    const c=jpContents[i];

    if (mode=="") {
      //start of a new line, mode is not decided
      s = "";

    switch (c) {
      case "$":  //note mode line starts with "$"
        mode = "note";
        tdIsNote = [];
        s = noteBeginHTML();
      break;
      case "@":  //chord mode line starts with "@"
        alert("chord mode not finished");
      break;
      case "/":
        mode = "freetext";
        s = freetextBegin + 'height:' + (lyricsSizeNum * 1.1) + 'px;">';
      break;
      default:
        mode = "lyrics";
        s = lyricsBegin + 'height:' + (lyricsSizeNum * 1.1) + 'px;">';
        iLyricsChar = 0;
        lastLyricCenterPosition = -lyricsSizeNum;
      break;
    }//switch
    }//if


  switch (mode) {
  case "note":
    switch (c) {
      case "$":
        //no output is necessary
      break;
      case "{":
        //moved to phase 2
      break;
      case "}":
        //moved to phase 2
      break;
      case "(":
        if (underline<2) {underline ++;}
      break;
      case ")":
        if (underline>0) {underline --;}
      break;
      case "^":
        octave = 1;
      break;
      case "v":
        octave = -1;
      break;
      case "b":
      case "#":
        tdIsNote.push(0);
        switch (underline) {
          case 0:
            t = t4[fontColorNum];
          break;
          case 1:
            t = t8[fontColorNum];
          break;
          case 2:
            t = t16[fontColorNum];
          break;
        }
        if (c==="#") {
          s += sharp1 + t + sharp2;
        }
        else if (c==="b") {
          s += flat1 + t + flat2;
        }
      break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
        tdIsNote.push(1);
        switch (underline) {
          case 0:
            t = t4[fontColorNum];
          break;
          case 1:
            t = t8[fontColorNum];
          break;
          case 2:
            t = t16[fontColorNum];
          break;
        }

        switch (octave) {
          case 1:
            s += tdStart + c + hi1 + note + c + t + lo0;
            break;
          case 0:
            s += tdStart + c + hi0 + note + c + t + lo0;
            break;
          case -1:
            s += tdStart + c + hi0 + note + c + t + lo1;
            break;
        }
        octave = 0;  //reset octave only after note is rendered
      break;
      case "-":
        tdIsNote.push(0);
        s += dash;
      break;
      case ".":
        tdIsNote.push(0);
        switch (underline) {
          case 0:
            t = t4[fontColorNum];
          break;
          case 1:
            t = t8[fontColorNum];
          break;
          case 2:
            t = t16[fontColorNum];
          break;
        }
        //s += hi0+note+"<b>·</b>"+t+lo0;
        //s += hi0+note+"·"+t+lo0;
        //s += tdStart + c + hi0 + dot + "." + t + lo0;
        //s += tdStart + "." + hi0 + dot + "." + t + lo0;
        s += tdStart + "." + hi0 + dot + "<b>·</b>" + t + lo0;
      break;
      case "_":  //small gap for all t4/t8/t16 notes
        tdIsNote.push(0);
        s += noteSpace;
      break;
      case " ":  //for underline through
        tdIsNote.push(0);
        switch (underline) {
          case 0:
            s += t4Space;
          break;
          case 1:
            s += t8Space[fontColorNum];
          break;
          case 2:
            s += t16Space[fontColorNum];
          break;
        }
      break;

      case "|":
        tdIsNote.push(0);
        s += bar[fontColorNum];
        underline = 0;  //reset time underline whenever new bar
      break;
      case "]":
        tdIsNote.push(0);
        s += songEnd[fontColorNum];
        underline = 0;  //reset time underline whenever new bar
      break;


      //when note line is finished, update note position array
      // ..|  td(n)  |     td(n+1)     |
      //        ^pos[n]       ^pos[n+1]=n/2+(n+1)/2

      //   +-------------------+
      // ..|<-- td[j].width -->|
      //   +-------------------+
      //   ^.offsetLeft

      case "\n":  //end of note line
        s += noteEnd;  //</table>
        eRenderArea.innerHTML += s;  //finish note mode and flush s into innerHTML
        s = "";
        mode = "";  //reset mode at new line
        var lastTable = document.getElementsByTagName("table").length;
        lastTable = document.getElementsByTagName("table")[lastTable-1];
        var tr = lastTable.getElementsByTagName("tr")[1];  //[0] is r1 for slur
        var td = tr.getElementsByTagName("td");

        tdCenterPosition = [];
        for (var j=0,iNote=0;j<td.length;j++) {
          //only record <td> with notes, skip <td> which is not a note
          if (tdIsNote[j] === 1) {
            //debug
            if (j===3) {
              var eTD = td[j];
            }
            //normal character
            tdCenterPosition[iNote] = td[j].offsetLeft + td[j].offsetWidth/2;
            iNote ++;

            debugWatchValue = td[j].offsetLeft;
          }
        }
      break;



      default:
        tdIsNote.push(0);
        s += tdStart + c + hi0 + note + c + t4[fontColorNum] + lo0;
      break;
    }//switch c
  break;//case "note"



  case "lyrics":
    switch (c) {
      case "\n":  //the only way to exit lyrics mode is new line
        s += lyricsEnd;  //</div>
        eRenderArea.innerHTML += s;  //finish lyrics mode and flush s into innerHTML
        s = "";
        mode = "";  //reset mode at new line
      break;



/*********************************************
   adaptive lyrics positioning
              +--------------+
              |   <td> note  |
              +--------------+
                      ^tdCenterPosition[iLyricsChar]=p1
+----------------++----------------+
|                ||                |
|     char 1     ||     char 2     |  max(p1,p2)=p2, use whichever larger
|<- lyricsSize ->||                |  if we use smaller p1, char 2 will overlap char 1
+----------------++----------------+
         ^                ^p2
          lastLyricCenterPosition

         |<- lyricsSize ->|
*********************************************/
      default:  //lyrics characters

        //p1: note center position
        //p2: lyrics line-up center position
        if (iLyricsChar < tdCenterPosition.length) {
          p1 = tdCenterPosition[iLyricsChar];
          iLyricsChar ++;
        }
        
        if (c===" ") {
          //" " is only for advancing index to the next note
          //no <span> output to the HTML
          //lastLyricCenterPosition remains the same

          //s += "";
          //lastLyricCenterPosition = lastLyricCenterPosition;
        }
        else {
          p2 = lastLyricCenterPosition + lyricsSizeNum;  //=span.ly{font-size:36px;}
          lastLyricCenterPosition = Math.max(p1,p2);
          s += '<span class="ly" style="left:'
            + (lastLyricCenterPosition + lyricsPositionOffset) + 'px;">' + c + '</span>';
        }


      break;
    }//switch c
  break;//case "lyrics"


  case "freetext":  //no alignment to notes
  default:
    switch (c) {
      case "/":
        //do nothing
      break;
      case "\n":  //the only way to exit this mode is new line
        s += freetextEnd;
        eRenderArea.innerHTML += s;  //finish lyrics mode and flush s into innerHTML
        s = "";
        mode = "";  //reset mode at new line
      break;
      case " ":
        s += "&nbsp;";
      break;
      default:
        s += c;
      break;
    }//switch c
  break;//case "freetext"




  }//switch mode

  }//for

  if (s.length>0) eRenderArea.innerHTML += s;  //flush s when s is not empty


  // ==========================================
  // re-visit whole user string to add slurs/triplets on rendered HTML
  // ==========================================

  //var iTD = 0;
  //var preSpan = 0;  //init
  //var row1;
  var slurEnd=0;
  var slurBegin=0;

  mode = "";  //init mode
  for (i=0;i<jpContents.length;i++) {
    const c= jpContents[i];

    //init mode
    if (mode=="") {
      if (c=="$") {  //note mode line starts with "$"
        mode = "note";
        iTD = 0;  //reset iTD at new line
        preSpan = 0;  //reset preSpan
        row1 = document.getElementById("r1");
      }
      else {
        mode = "lyrics";
      }
    }


  switch (mode) {
  case "note":
    switch (c) {
      case "$":
        //no <td> is used
      break;
      case "{":
        slurBegin = iTD;
      break;
      case "}":
        slurEnd = iTD;
        var ss = preSpan1 + (slurBegin-preSpan) + preSpan2 ;
        ss += slur1 + (slurEnd-slurBegin) + slur2[fontColorNum];
        row1.innerHTML += ss;
        preSpan = slurEnd;
      break;
      case "\n":
        mode = "";  //reset mode at new line
      break;
      default:
        iTD ++;
      break;
    }//switch c
  break;//case "note"

  case "lyrics":
  default:
    switch (c) {
      case "\n":  //the only way to exit lyrics mode is new line
        mode = "";  //reset mode at new line
      break;
      default:
      break;
    }//switch c
  break;//case "lyrics"


  }//switch mode

  }//for

}//function




//==================
// file functions
//==================

//build open file list
function updateFileList() {

  //clear the options
  eOpenFileSelect.innerHTML = "";  //simplest way to clear options

  //create a dummy label option
  var opt = document.createElement("option");
  opt.value = defaultFileSelectElementValue;
  opt.disabled = true;
  opt.innerHTML = eOpenFileSelect.getAttribute("name");  //"- open file -";
  eOpenFileSelect.appendChild(opt);

  //create a demo entry option
  opt = document.createElement("option");
  opt.value = demoStorageKey;
  opt.innerHTML = sDemoFile;
  eOpenFileSelect.appendChild(opt);

  if (0) {  //not working
  //create a load PC file entry option
  opt = document.createElement("option");
  opt.value = openPCFileOptionValue;
  opt.innerHTML = sLoadPCFile;
  eOpenFileSelect.appendChild(opt);
  }

  //create existing saved file list
  existingFilenames = [];
  for (var i=0; i<localStorage.length; i++) {
    var key = localStorage.key(i);
    //search for filenamePrefix
    if (key.startsWith(filenamePrefix)) {
      var fname = convert2UserFilename(key);  //fname = user filename

      //create list options
      opt = document.createElement("option");
      opt.value = key;
      opt.innerHTML = fname;
      eOpenFileSelect.appendChild(opt);

      //update existingFilenames[]
      existingFilenames.push(fname);
    }
  }

  //set the list to default option
  eOpenFileSelect.value = defaultFileSelectElementValue;
}

function convert2UserFilename(full_name) {
  //remove filenamePrefix from full filename for displaying
  return full_name.substring(filenamePrefix.length);  //filenamePrefix includes version digits
}

function askUserToConfirmRemovingContents() {
  var confirmRemoving = false;
  if (notSaved) {
    if (confirm(sConfirmNotSaved) == true) {
      confirmRemoving = true;
    }
  }
  else {
    //if saved already, open anyway
    confirmRemoving = true;
  }
  return confirmRemoving;
}

function updateUserFilenameDisplayAndLocalStorage() {
  var editedLabel="";
  if (notSaved) {
    editedLabel = sEdited;
  }
  if (userFilename === "") {
    //no name document
    eFilenameSpan.innerHTML = sUnnamed + editedLabel;
    eDeleteButton.style.visibility = "hidden";
  }
  else {
    //valid file name
    eFilenameSpan.innerHTML = userFilename + editedLabel;
    eDeleteButton.style.visibility = "visible";  //only valid files can be deleted
  }
  localStorage.setItem(userFilenameStorageKey,userFilename);  //save current filename
}





//===========================
// parse raw file structure
//===========================
const configSeparatorTag = "%CONFIG%";
var rawFileString = "";  //for import and open file
function parseRawFileToContentsAndConfig() {
  var fileStructure = rawFileString.split(configSeparatorTag);
  if (fileStructure.length === 2) {
    jpContents = fileStructure[0];
    configString = fileStructure[1];
  }
  else {
    //file is older version without config string
    jpContents = rawFileString;
    configString = defaultConfigString;
  }
  return;
}

//===========================
// import file
//===========================
const ePCFileInput = document.getElementById("pcFileInput");
ePCFileInput.addEventListener("change", function () {
  importFile();
}, false);

document.getElementById("import").addEventListener("click", function () {
  ePCFileInput.click();
}, false);

function importFile() {
  var input, file, fr;

  //input = document.getElementById('userPCFile');
  file = ePCFileInput.files[0];
  fr = new FileReader();
  fr.onload = loadFileOK;
  fr.readAsText(file);
  userFilename = file.name;

  //callback on read file completion
  function loadFileOK() {
    rawFileString = fr.result;
    parseRawFileToContentsAndConfig();

    //fill in eJPContents and configString textareas
    eJPContents.value = jpContents;
    eConfigTextArea.value = configString;

    //config properties
    assignConfigToVariables();
    renderOutputDocument();
    refreshEditorUI();

    //display filename
    notSaved = true;  //an imported file is always notSaved!!
    updateUserFilenameDisplayAndLocalStorage();
  }
}
//========================================================================
// open file
//
// file structure: jpContents + configSeparatorTag + configString
//========================================================================
eOpenFileSelect.addEventListener("change", function () {
  if (askUserToConfirmRemovingContents()) {
    //update userFilename
    if (eOpenFileSelect.value === demoStorageKey) {
      //special file: demo file
      userFilename = "";
    }
    else {
      userFilename = 
        eOpenFileSelect.options[eOpenFileSelect.selectedIndex].text;
      //alert("open file: "+ userFilename);
    }

    //parse file structure to prepare jpContents and configString
    rawFileString = localStorage[eOpenFileSelect.value];
    parseRawFileToContentsAndConfig();

    //fill in eJPContents and configString textareas
    eJPContents.value = jpContents;
    eConfigTextArea.value = configString;

    //config properties
    assignConfigToVariables();
    renderOutputDocument();
    refreshEditorUI();

    //display filename
    notSaved = false;  //open existing file means: saved
    updateUserFilenameDisplayAndLocalStorage();
  }
  else {
    //cancel opening file
    //eOpenFileSelect.value = prevFileSelectElementValue;  //restore selection
  }

  //to simplify usage, always set to default after open file
  eOpenFileSelect.value = defaultFileSelectElementValue;

}, false);


//==================
// save
//==================
function filenameExists(fname) {
  var exist = false;
  for (var i=0;i<existingFilenames.length;i++) {
    if (userFilename === existingFilenames[i]) {
      //skip current file
      continue;
    }
    else if (fname === existingFilenames[i]) {
      exist = true;
      break;
    }
  }
  return exist;
}

function userConfirmsFileOverwrite(fname) {
  var overwrite = false;
  if (confirm(sOverwriteAreYouSure1 + fname + sOverwriteAreYouSure2) == true) {
    overwrite = true;
  }
  return overwrite;
}

function saveContentsToFilename(filename) {
  userFilename = filename;
  fullFilename = filenamePrefix + filename;
  //jpContents = eJPContents.value;
  localStorage.setItem(userFilenameStorageKey, filename);
  localStorage.setItem(fullFilename, 
    jpContents + configSeparatorTag + configString);

  //saved successfully
  notSaved = false;
  updateUserFilenameDisplayAndLocalStorage();
  updateFileList();  //update file list to include this new file
}

document.getElementById("save").addEventListener("click", function () {
  //prompt for filename
  var filenameInput = prompt(sInputSaveFilename, userFilename);

  if (filenameInput === null) {
    //user press cancel
  }
  else {
    filenameInput = filenameInput.replace(/(\r\n|\n|\r)/gm, "");  //remove cr/lf
    filenameInput = filenameInput.trim();  //remove extra spaces
    if (filenameInput != "") {
      //check if duplicate to existing file
      if (filenameExists(filenameInput)) {
        if (userConfirmsFileOverwrite(filenameInput)) {
          saveContentsToFilename(filenameInput);
        }
      }
      else {
        saveContentsToFilename(filenameInput);
      }
    } else {
      alert(sInvalidFileName);
    }
  }
}, false);


//==================
// new file
//==================
//called by new_file button and delete button
function newFile() {
  //prepare jpContents and configString
  jpContents = newFileContents;
  configString = defaultConfigString;

  //fill in eJPContents and configString textareas
  eJPContents.value = jpContents;
  eConfigTextArea.value = configString;

  //config properties
  assignConfigToVariables();
  renderOutputDocument();
  refreshEditorUI();

  userFilename = "";
  notSaved = false;  //notSaved need to be set before next function
  updateUserFilenameDisplayAndLocalStorage();
}
document.getElementById("new_file").addEventListener("click", function () {
  if (askUserToConfirmRemovingContents()) {
    newFile();
  }
}, false);


//==================
// delete
//==================
eDeleteButton.addEventListener("click", function () {
  if (userFilename === "") {
    //delete no name file is equal to new file
    if (askUserToConfirmRemovingContents()) {
      newFile();
    }
  }
  else {
    if (confirm(sDeleteAreYouSure1 + userFilename + sDeleteAreYouSure2) == true) {
      //perform deletion
      localStorage.removeItem(filenamePrefix + userFilename);
      updateFileList();  //update file list
      newFile();  //create a blank file
    }
  }
}, false);


//==================
// textarea edited
//==================
eJPContents.addEventListener("input", function () {
  jpContents = eJPContents.value;
  buildJPContentsHTML();
  if (!notSaved) {
    //it was saved, now it is edited
    markNotSaved();
  }
  eConfigTextArea.value = debugWatchValue;
}, false);




//==================================
// export jpContents as a text file
//==================================
const eExportButton = document.getElementById('export');

function exportContentsAsFile() {
  var textFileAsBlob = new Blob([ jpContents + configSeparatorTag + configString ], { type: 'text/plain' });
  var fileNameToSaveAs = userFilename + ".ksjp.txt";  //filename.extension

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = function (e) {
      document.body.removeChild(e.target);
    };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
}
eExportButton.addEventListener('click', exportContentsAsFile);



//==================
// web page closed
//==================
window.onbeforeunload = function() {
  if (debugFlag) {
    return;
  }
  //convert logic to string to save notSaved state
  localStorage.setItem(notSavedFlagStorageKey, (notSaved?"true":"false"));

  //save current filename
  localStorage.setItem(userFilenameStorageKey, userFilename);

  //save current editing contents
  localStorage.setItem(tempContentsStorageKey, eJPContents.value);

  //save current editor config
  localStorage.setItem(tempConfigStorageKey, configString);
};


var debugFlag = false;
//==================
// debug
//==================
document.getElementById("debug").addEventListener("click", function () {
  //debug
  debugFlag = true;

  //delete all user localStorage
  var i = 0;
  var key = "";
  while (i < localStorage.length) {
    key = localStorage.key(i);

    //search for filenamePrefix
    if (key.startsWith(keySignature)) {
      localStorage.removeItem(key);  //remove will affect array indexing
      //i has been automatically advanced, do not ++i
    }
    else {
      ++i;
    }
  }

  //display result for validation
  var s = "";
  for (var i=0; i<localStorage.length; i++) {
    s += localStorage.key(i) + "\n";
  }//for
  alert ("localStorage:\n" + s);
}, false);









//==================
// init procedure
//==================

//1. store demo contents before being edited by user
//use innerHTML to fetch original html contents (.value is for run-time actual value)
localStorage.setItem(demoStorageKey, eJPContents.innerHTML);

//2.restore previous state (filename, contents, notSaved flag)
jpContents = localStorage[tempContentsStorageKey];
if (jpContents === undefined) {
  //default demo
  jpContents = eJPContents.innerHTML;
}
else {
  //previous contents exist
  eJPContents.value = jpContents;
}
configString = localStorage[tempConfigStorageKey];
if (configString === undefined) {
  //default config
  configString = defaultConfigString;
}
else {
  //previous config exists
  eConfigTextArea.value = configString;
}

//3. restore userFilename (after notSaved is confirmed by temp contents)
userFilename = localStorage[userFilenameStorageKey];
if (userFilename === undefined) {
  //first time usage
  userFilename = "";
}

//4. restore notSaved flag and then update userFilename
var notSavedStr = localStorage[notSavedFlagStorageKey];
if (notSavedStr === undefined) {
  //first time usage
  notSaved = false;
}
else {
  notSaved = (notSavedStr === "true" ? true:false);  //convert string to logic
}
updateUserFilenameDisplayAndLocalStorage();

//5. update file list
updateFileList();

//6. output document page
assignConfigToVariables();  //equivalent to editor UI operation
renderOutputDocument();
refreshEditorUI();

//7. update config text
eConfigTextArea.value = configString;



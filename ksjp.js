//to do list:

// show cursor in render area
//cursor for lyrics/text
//cursor for chord
//cursor not working outside table span

//drawTab bug


// note size can auto change td style min-width
// source file font size adjustable
// adjustable render area dimension
// export all files
// import into saved files
// sharp/flat spacing too far
// support full-width space

//new file default
const newFileContents = '/  歌名\n\n$|';
const defaultConfigString = 'fc=0,bc=white,bcss=#fa3,nf=monospace,ns=22,lf=kai,ls=28,cf=monospace,cs=18,f1=Trebuchet MS,s1=14,f2=Comic Sans MS,s2=54,dm=0';



//string const
const sDemoFile = '內建範例檔';
const sLoadPCFile = '開啟資料夾內檔案';
const sConfirmNotSaved = '編輯內容尚未存檔，確定要繼續？';
const sEdited = ' - 已編輯';
//const sEdited = '*';
const sUnnamed = '未命名';
const sDeleteAreYouSure1 = '確定要刪除文件「';
const sDeleteAreYouSure2 = '」嗎？';
const sOverwriteAreYouSure1 = '檔案「';
const sOverwriteAreYouSure2 = '」已存在，確定要取代嗎？';
const sInputSaveFilename = '存檔名稱：';
const sInvalidFileName = '無效檔名';


//definition const
const fontKai = "'標楷體','kai','BiauKai','全字庫正楷體', 'TW-Kai', STKaiti, DFKai-SB";
const fontHei = "'正黑體',PingFang, STHeiti, 'Microsoft JhengHei'";
const fontMing = "STSong, 'LiSong Pro', 'Apple LiSung Light',PMingLiU";


const keySignature = 'ks_church_jianpu_';
const versionNumber = '11';
const filenamePrefix = keySignature + versionNumber;
const userFilenameStorageKey = keySignature + 'user_filename';  //to save current userFilename
const tempContentsStorageKey = keySignature + 'temp_contents';  //to save temp contents
const tempConfigStorageKey = keySignature + 'temp_config';  //to save temp config
const notSavedFlagStorageKey = keySignature + 'not_saved_flag';  //to save flag
const demoStorageKey = keySignature + 'demo';  //to store demo contents

//file area element
const eOpenFileSelect = document.getElementById('openfile');
const eFilenameSpan = document.getElementById('filename');
const eDeleteButton = document.getElementById('b_delete');
const defaultFileSelectElementValue = 'file_list_label_option';
const openPCFileOptionValue = 'open_pc_file_option';

//main area blocks
const eJPContents = document.getElementById('jp_contents');
const eRenderArea = document.getElementById('render_area');
const ePreRenderArea = document.getElementById('pre_render_area');
const eConfigTextArea = document.getElementById('config_text');

//render area element
const eFontColor = document.getElementById('font_color');
const eBackgroundColor = document.getElementById('bg_color');
const eCSSColor = document.getElementById('css_color');
const eLyricsFont = document.getElementById('lyrics_font');
const eLyricsSize = document.getElementById('lyrics_size');
const eNoteFont = document.getElementById('note_font');
const eNoteSize = document.getElementById('note_size');
const eChordFont = document.getElementById('chord_font');
const eChordSize = document.getElementById('chord_size');
const eText1Font = document.getElementById('text1_font');
const eText1Size = document.getElementById('text1_size');
const eText2Font = document.getElementById('text2_font');
const eText2Size = document.getElementById('text2_size');
const eShowTab = document.getElementById('showtab');
const eShowCursor = document.getElementById('showcursor');
const eShowTD = document.getElementById('showtd');


var lyricsCenter2LeftOffset = 24;  //convert center to left (X-coordinate)
var chordPositionOffset = 24;

function noteTableBegin(iTable) {
  var s='';

  s +=
'<!--note table ' + iTable + '--><div style="position:relative;">' +
'<div class="chordtabline"></div>' +
'<div class="lyricstabline"></div>' +
'<table class="nt" style="font-family:' + noteFont +
';font-size:' + noteSize + 'px;"><tr></tr><tr>';

  return s;
}
function noteTableEnd() {
  var s = '</tr></table></div>';
  return s;
}

const tab0 = '<div class="tab" style="left:';
const tab1 = 'px;">&#9661;</div>';  //▽
const tab1occupied = 'px;">&#9660;</div>';  //▼
const tab2 = 'px;">&#9651;</div>';  //△
const tab2occupied = 'px;">&#9650;</div>';  //▲
//const tab1 = 'px;">&#9663;</div>';  //▿
//const tab1occupied = 'px;">&#9662;</div>';  //▾
//const tab2 = 'px;">&#9653;</div>';  //▵
//const tab2occupied = 'px;">&#9652;</div>';  //▴

const preSpan1 = '<!-- prespan --><td class="tdcur" colspan="';
const preSpan2 = '">&nbsp;</td>';

//const triplet1 = '<!-- triplet --><td class="tdcur" colspan="';
//[0]=black, [1]=white
//const triplet2 = ['">3<div class="cur_b"></div></td>','">3<div class="cur_w"></div></td>'];

const slur1 = '<!-- slur --><td class="tdcur" colspan="';
//[0]=black, [1]=white
const slur2_long = ['">&nbsp;<div class="cur cur_long cur_b"></div></td>',
                    '">&nbsp;<div class="cur cur_long cur_w"></div></td>'];
const slur2_short = ['">&nbsp;<div class="cur cur_short cur_b"></div></td>',
                     '">&nbsp;<div class="cur cur_short cur_w"></div></td>'];


/*
 triple element:
 0~7: <tdBegin + noteBegin + >hi1 + n + c + t + lo0
 dot: <tdBegin + >hi0 + dot + '<b>·</b>' + t + lo0;
 default: <tdBegin + >hi0 + n + c + t4[fontColorNum] + lo0;
*/
function tdBegin(idCursor) {
  return '<td id="' + idCursor + '"';
}
function noteBegin() {
  if (showTD) {
    return ' style="border: 1px solid red;"';
  }
  else {
    return '';
  }
}

const hi0 = '><div class="hi"></div>';
const hi1 = '><div class="hi">.</div>';
const n = '<div class="n">';
const dot = '<div class="dot">';

//[0]=black, [1]=white
const t4 = ['</div><div class="t4_b"></div>','</div><div class="t4_w"></div>'];
const t8 = ['</div><div class="t8_b"></div>','</div><div class="t8_w"></div>'];
const t16 = ['</div><div class="t16_b"></div>','</div><div class="t16_w"></div>'];

const lo0 = '<div class="lo"></div></td>';
const lo1 = '<div class="lo">.</div></td>';


//dual element: 1 + 2
// ♮♯♭: <tdBegin + >n1/s1/f1 + n2/s2/f2
const natural1 = '><div class="nnatural">&#x266e;</div><div class="hi"></div>';  //♮
const natural2 = '<div class="lo"></div></td>';
const sharp1 = '><div class="nsharp">&#x266f;</div><div class="hi"></div>';  //♯
const sharp2 = '<div class="lo"></div></td>';
const flat1 = '><div class="nflat">&#x266d;</div><div class="hi"></div>';  //♭
const flat2 = '<div class="lo"></div></td>';

//single element
//<tdBegin + >t4/8/16Space
//<tdBegin + >dash
//<tdBegin + >bar
//<tdBegin + >songEnd
const t4Space = ' class="sp4"></td>';
//[0]=black, [1]=white
const t8Space = ['><div class="hi"></div><div class="n"></div><div class="t8_b"></div><div class="lo"></div></td>',
'><div class="hi"></div><div class="n"></div><div class="t8_w"></div><div class="lo"></div></td>'];
//[0]=black, [1]=white
const t16Space = ['><div class="hi"></div><div class="n"></div><div class="t16_b"></div><div class="lo"></div></td>',
'><div class="hi"></div><div class="n"></div><div class="t16_w"></div><div class="lo"></div></td>'];

const dash = '><div class="hi"></div><div class="n">－</div><div class="t4"></div><div class="lo"></div></td>';

//[0]=black, [1]=white
const bar = ['><div class="bar_b"></div></td>',
'><div class="bar_w"></div></td>'];
const songEnd = ['><div class="double_bar_b"></div></td>',
'><div class="double_bar_w"></div></td>'];



const chordBegin = '<div class="chord_div" style="';
/*function chordBegin(idCursor) {
  return '<div id="' + idCursor + '" class="chord_div" style="';
}*/
const chordEnd = '</div>';

//const lyricsBegin = '<div class="lyrics_div" style="';
function lyricsBegin(iLine) {
  return '<div id="L' + iLine + '" class="lyrics_div" style="';
}
const lyricsEnd = '</div>';

const freetextBegin = '<div class="freetext" style="';
const freetextEnd = '</div>';



var userFilename = '';  //current user filename
var fullFilename = '';  //= filenamePrefix + userFilename
var jpContents = '';
var notSaved;  //will be true once jp_contents are edited
var existingFilenames = [];  //for checking duplicate filename against user input

var debugWatchValue=0;

//==================
// config
//==================
const configKeyFontColor = 'fc';
const configKeyBackgroundColor = 'bc';
const configKeyBackgroundCSSColor = 'bcss';
const configKeyLyricsFont = 'lf';
const configKeyLyricsSize = 'ls';
const configKeyNoteFont = 'nf';
const configKeyNoteSize = 'ns';
const configKeyChordFont = 'cf';
const configKeyChordSize = 'cs';
const configKeyText1Font = 'f1';
const configKeyText1Size = 's1';
const configKeyText2Font = 'f2';
const configKeyText2Size = 's2';
const configKeyDummy = 'dm';
const itemSeparator = ',';
var configString = defaultConfigString;


//==================
// debug
//==================
var debugFlag = false;
document.getElementById('debug').addEventListener('click', function () {
  //debug
  debugFlag = true;
  return;
}, false);


//====================
// clear localStorage
//====================
var clearStorageFlag = false;
document.getElementById('clear_storage').addEventListener('click', function () {
  clearStorageFlag = true;
  //delete all user localStorage
  var i = 0;
  var key = '';
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
  var s = '';
  for (i=0; i<localStorage.length; i++) {
    s += localStorage.key(i) + '\n';
  }//for
  alert ('localStorage:\n' + s);
}, false);









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
  calculateNoteAlignmentOffset();  //set fine-tune before building contents HTML
  buildJPContentsHTML();  //after all styles are set, for width calculation
  setCursorEventOnEachNote();
  setCursorEventOnEachLyricChar();
  setAreaGlobalStyles();
  drawTab();
}

//called whenever any config value changes
function rebuildConfigString() {
  configString = 
		configKeyFontColor + '=' + fontColorNum + itemSeparator +
		configKeyBackgroundColor + '=' + backgroundColor + itemSeparator +
		configKeyBackgroundCSSColor + '=' + backgroundCSSColor + itemSeparator +
		configKeyNoteFont + '=' + noteFont + itemSeparator +
		configKeyNoteSize + '=' + noteSize + itemSeparator +
		configKeyLyricsFont + '=' + lyricsFont + itemSeparator +
		configKeyLyricsSize + '=' + lyricsSize + itemSeparator +
		configKeyChordFont + '=' + chordFont + itemSeparator +
		configKeyChordSize + '=' + chordSize + itemSeparator +
		configKeyText1Font + '=' + text1Font + itemSeparator +
		configKeyText1Size + '=' + text1Size + itemSeparator +
		configKeyText2Font + '=' + text2Font + itemSeparator +
		configKeyText2Size + '=' + text2Size + itemSeparator +
		configKeyDummy + '=' + '0';
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
    var key = configItem[i].split('=')[0];
    var value = configItem[i].split('=')[1];
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
        noteSizeNum = Number(noteSize);
      break;
      case configKeyChordFont:
        chordFont = value;
      break;
      case configKeyChordSize:
        chordSize = value;
        chordSizeNum = Number(chordSize);
      break;
      case configKeyText1Font:
        text1Font = value;
      break;
      case configKeyText1Size:
        text1Size = value;
        text1SizeNum = Number(text1Size);
      break;
      case configKeyText2Font:
        text2Font = value;
      break;
      case configKeyText2Size:
        text2Size = value;
        text2SizeNum = Number(text2Size);
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
      eFontColor.value = '0';
    break;
    case 1:
      eFontColor.value = '1';
    break;
    default:
      eFontColor.value = '0';
    break;
  }//switch


  //background color
  switch (backgroundColor) {
    case 'black':
      eBackgroundColor.value = 'black';
    break;
    case 'white':
      eBackgroundColor.value = 'white';
    break;
    default:
      eBackgroundColor.value = 'css_color';
    break;
  }//switch

  //CSS text
  eCSSColor.value = backgroundCSSColor;  //this will interfere user input, moved to

  //lyrics, note and chord
  eLyricsFont.value = lyricsFont;
  eLyricsSize.value = lyricsSize;
  eNoteFont.value = noteFont;
  eNoteSize.value = noteSize;
  eChordFont.value = chordFont;
  eChordSize.value = chordSize;

  //text1 and text2
  eText1Font.value = text1Font;
  eText1Size.value = text1Size;
  eText2Font.value = text2Font;
  eText2Size.value = text2Size;
}



//===================================
// setting render area global styles
//===================================

function isCSSColorValid(stringToTest) {
  //Alter the following conditions according to your need.
  if (stringToTest === '') { return false; }
  if (stringToTest === 'inherit') { return false; }
  if (stringToTest === 'transparent') { return false; }

  var image = document.createElement('img');
  image.style.color = 'rgb(0, 0, 0)';
  image.style.color = stringToTest;
  if (image.style.color !== 'rgb(0, 0, 0)') { return true; }
  image.style.color = 'rgb(255, 255, 255)';
  image.style.color = stringToTest;
  return image.style.color !== 'rgb(255, 255, 255)';
}

function converChineseFontFamily(f) {
  switch (f) {
    case 'kai':
      return fontKai;
    break;
    case 'hei':
      return fontHei;
    break;
    case 'ming':
      return fontMing;
    break;
    default:
      return f;
  }
}

function setAreaGlobalStyles() {
  //lyrics size
  eRenderArea.style.fontSize = lyricsSize + 'px';

  //lyrics font
  eRenderArea.style.fontFamily = converChineseFontFamily(lyricsFont);

  //font color global part
  eRenderArea.style.color = 'black';
  if (fontColorNum === 1) {
    eRenderArea.style.color = 'white';
  }

  // if sel=css_color -> renderBackgroundCSSColor(css value);
  // else (black or white) -> renderBackgroundColor(bg value);
  if (backgroundColor === 'css_color') {
    if (isCSSColorValid(backgroundCSSColor)) {
      eRenderArea.style.backgroundColor = backgroundCSSColor;
    }
    else {
      //invalid css color, set color to gray
      eRenderArea.style.backgroundColor = 'gray';
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
//const renderAreaPadding = 0;  //40;
var tabPositionOffset = 0;
function calculateNoteAlignmentOffset() {
  lyricsCenter2LeftOffset = (lyricsSizeNum/2) + 0.5;
  tabPositionOffset = - 4;
}

//===============================
// lyrics size (global property)
//===============================
var lyricsSize = '36';  //default font-size in span.ly {
var lyricsSizeNum = Number(lyricsSize);
eLyricsSize.addEventListener('change', function (e) {
  lyricsSize = e.target.value;
  lyricsSizeNum = Number(lyricsSize);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//===============================
// chord size <div style> property
//===============================
var chordSize = '36';  //default font-size in span.ly {
var chordSizeNum = Number(chordSize);
eChordSize.addEventListener('change', function (e) {
  chordSize = e.target.value;
  chordSizeNum = Number(chordSize);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//================================
// note size
//================================
var noteSize = '26';  //default font-size in table.nt {
var noteSizeNum = Number(noteSize);
eNoteSize.addEventListener('change', function (e) {
  noteSize = e.target.value;
  noteSizeNum = Number(noteSize);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//================================
// text1 size
//================================
var text1Size = '28';
var text1SizeNum = Number(text1Size);
eText1Size.addEventListener('change', function (e) {
  text1Size = e.target.value;
  text1SizeNum = Number(text1Size);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);
//================================
// text2 size
//================================
var text2Size = '22';
var text2SizeNum = Number(text2Size);
eText2Size.addEventListener('change', function (e) {
  text2Size = e.target.value;
  text2SizeNum = Number(text2Size);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//===============================
// lyrics font (global property)
//===============================
var lyricsFont = 'kai';
eLyricsFont.addEventListener('change', function (e) {
  lyricsFont = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//================================
// chord font
//================================
var chordFont = 'monospace';
eChordFont.addEventListener('change', function (e) {
  chordFont = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//================================
// note font
//================================
var noteFont = 'monospace';
eNoteFont.addEventListener('change', function (e) {
  noteFont = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//===============================
// text1 font (innerHTML property) ???
//===============================
var text1Font = 'kai';
eText1Font.addEventListener('change', function (e) {
  text1Font = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);
//===============================
// text2 font (innerHTML property) ???
//===============================
var text2Font = 'kai';
eText2Font.addEventListener('change', function (e) {
  text2Font = e.target.value;
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);

//===============================
// show tab
//===============================
var showTab = false;
eShowTab.addEventListener('change', function (e) {
  showTab = e.target.checked;
//  drawTab();
  renderOutputDocument();
}, false);

//===============================
// show cursor
//===============================
var showCursor = false;
eShowCursor.addEventListener('change', function (e) {
  showCursor = e.target.checked;
  cursor();
  eJPContents.focus();
}, false);

//===============================
// show TD
//===============================
var showTD = false;
eShowTD.addEventListener('click', function () {
//  showTD = e.target.checked;
  if (true || showTD) {
    var table = document.getElementsByClassName('nt');
    for (var t=0;t<table.length;t++) {
      var tr = table[t].getElementsByTagName('tr');
      for (var r=0;r<tr.length;r++) {
        var td = tr[r].getElementsByTagName('td');
        for (var d=0;d<td.length;d++) {
          td[d].style.border = '1px solid red';
        }//for d
      }//for r
    }//for t
  }// if
//  renderOutputDocument();
}, false);

//=========================================
// font color (global+inner HTML property)
//=========================================
var fontColorNum = 0;
function assignFontColorVariable(str) {
  switch (str) {
  case '0':
    fontColorNum = 0;
    if (backgroundColor === 'black') {
      backgroundColor = 'white';  //auto avoid invisible output
    }
  break;
  case '1':
    fontColorNum = 1;
    if (backgroundColor === 'white') {
      backgroundColor = 'black';  //auto avoid invisible output
    }
  break;
  default:
    fontColorNum = 0;
  break;
  }//switch
}
eFontColor.addEventListener('change', function (e) {
  assignFontColorVariable(e.target.value);
  renderOutputDocument();
  refreshEditorUI();
  rebuildConfigString();
  markNotSaved();
}, false);


//==================
// background color
//==================
var backgroundColor = 'white';
eBackgroundColor.addEventListener('change', function (e) {
  backgroundColor = e.target.value;

  //auto avoid invisible output
  switch (backgroundColor) {
    case 'black':
      if (fontColorNum === 0) {fontColorNum=1;}
    break;
    case 'white':
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
var backgroundCSSColor = '';
eCSSColor.addEventListener('input', function (e) {
  backgroundCSSColor = e.target.value;  //='#f8a' or 'rgb(128,120,20)' or 'red'
  renderOutputDocument();
  //refreshEditorUI();  //refresh is not necessary and will interfere user input cursor
  rebuildConfigString();
  markNotSaved();
}, false);


//===================================
//    render function
//===================================
function calculateLineHeight(fontSize) {
  var lineGap = Math.max(3, Math.round(fontSize * 0.1));
  return (fontSize + lineGap);
}
/*
  mode = ''  //init

  for every jpContents item {
    if mode == '' then
    {
      //check if [i] (or [i+1]) is a mode character
      switch (jpContents[i])
      $: mode='note' and continue next i
      #: mode='chord' and continue next i
      \: mode='freetext'
         switch (jpContents[i+1])
         '': can't decide freetext type yet, do nothing and continue next i
         1: freetext type 1, i++ and continue next i
         2: freetext type 2, i++ and continue next i
         else: freetext type 0 and continue next i
      else: mode='lyrics'
    }

    //from now on, mode is set and jpContents[i] is a rendering char
    c = jpContents[i]

    switch (mode) to render c accordingly
*/



/*
  |<-- offsetWidth -->|  offsetWidth = width + padding + border
  | |<- borderWidth
  +-+---------------+-+
  | |     td[j]     | |
  +-+---------------+-+
  ^.offsetLeft
*/
const numDummyNotes = 20;
function buildAlignmentPosition(noteLineIndex) {  //noteLineIndex starts with 1
  var i;
  var iLyrics = 0;
  var iChord = 0;

//  if (noteLineIndex>0) {
    var table = document.getElementsByClassName('nt')[0];
    var tr = table.getElementsByTagName('tr')[1];  //[0] is r1 for slur
    var td = tr.getElementsByTagName('td');

    noteCenterXForLyrics[noteLineIndex] = [];
    for (i=0,iLyrics=0; i<td.length; i++) {
      if (tdToAlignLyrics[noteLineIndex][i] === 1) {
        //only record center position of <td> that can be aligned by lyrics
        noteCenterXForLyrics[noteLineIndex][iLyrics] = 
          td[i].offsetLeft + td[i].offsetWidth/2;
        iLyrics ++;
      }
    }

    noteCenterXForChord[noteLineIndex] = [];
    for (i=0,iChord =0; i<td.length; i++) {
      if (tdToAlignChord[noteLineIndex][i] === 1) {
        //only record center position of <td> that can be aligned by chord
        noteCenterXForChord[noteLineIndex][iChord] = 
          td[i].offsetLeft + td[i].offsetWidth/2;
        iChord ++;
      }
    }
//  }//if

  //append dummy notes for allowing excessive lyrics/chords
  for (i=0;i<numDummyNotes;i++) {
    if (iLyrics === 0) {  //means td.length=0, no notes yet
      noteCenterXForLyrics[noteLineIndex][0] = Math.floor(noteSizeNum/2);
    }
    else {
      noteCenterXForLyrics[noteLineIndex][iLyrics] = 
        noteCenterXForLyrics[noteLineIndex][iLyrics-1] + noteSizeNum;
    }
    iLyrics ++;

    if (iLyrics === 0) {
      noteCenterXForChord[noteLineIndex][0] = Math.floor(noteSizeNum/2);
    }
    else {
      noteCenterXForChord[noteLineIndex][iChord] = 
        noteCenterXForChord[noteLineIndex][iChord-1] + noteSizeNum;
    }
    iChord ++;
  }
}

function drawTab() {
  var chordTabLines, lyricsTabLines;
  var i,j,pos,s;

  if (!showTab) {
    return;
  }

  chordTabLines = document.getElementsByClassName('chordtabline');
  lyricsTabLines = document.getElementsByClassName('lyricstabline');

  for (i = 1; i <= numNoteLines; i ++) {
    s = '';
    for (j=0;j<noteCenterXForChord[i].length-numDummyNotes;j++) {
      pos = noteCenterXForChord[i][j];
      s += tab0 + (pos+tabPositionOffset) +
(noteCenterXForChordOccupied[i][j]==1 ? tab1occupied : tab1);
    }//for j
    chordTabLines[i-1].innerHTML = s;

    s = '';
    for (j=0;j<noteCenterXForLyrics[i].length-numDummyNotes;j++) {
      pos = noteCenterXForLyrics[i][j];
      s += tab0 + (pos+tabPositionOffset) +
(noteCenterXForLyricsOccupied[i][j]==1 ? tab2occupied : tab2);
    }//for j

if (i<1) {
alert('bug1');
}
else {
    lyricsTabLines[i-1].innerHTML = s;
}
  }//for i
}



var chordLineChords = [];  //1st dimension: valid index starts with [1]
                           //2nd dimension: valid index starts with [0]
                           //i.e. chordLineChords starts with [1][0]
var chordLineChordWidth = [];  //1st dimension: valid index starts with [1]
                               //2nd dimension: valid index starts with [0]
function preProcessChordLines() {
  var chordString;
  var chordLines = jpContents.split('@');
  var s, chord;

  //to process BBB and DDD in 'AAA@BBB\nCCCC@DDD', so skip iChordLine=0
  for (var iChordLine = 1; iChordLine < chordLines.length; iChordLine ++) {
    chordString = chordLines[iChordLine];  //=BBB\nCCCC, DDD
    chordString = chordString.split('\n')[0];  //skip the part after \n
    chordLineChords[iChordLine] = chordString.split(' ');
    chordLineChordWidth[iChordLine] = [];

    ePreRenderArea.innerHTML = '';  //clear pre-render area
    for (var i=0;i<chordLineChords[iChordLine].length;i++)  {
      chord = chordLineChords[iChordLine][i];
      if (chord === '') {
        //' ' is only for advancing index to the next note
        //no render output
        chordLineChordWidth[iChordLine][i] = 0;  //width=0
      }
      else {
        //pre-render chords to retrieve <span> width
        s = chordBegin +
//'height:' + calculateLineHeight(chordSizeNum) + 'px;' +
'font-family:'+ noteFont + ';' +
'font-size:' + chordSize + 'px;' + '">';

        s += '<span id="chord_prerender" class="ly">' + chord + '</span>';
        s += chordEnd;  //</div>

        ePreRenderArea.innerHTML = s;

        var e = document.getElementById('chord_prerender');
        chordLineChordWidth[iChordLine][i] = e.offsetWidth;
      }//if
    }//for
  }//for
  var i=i;
}



/*-------------------------------------------
 pre-process each $ note lines:
 1. build: noteLineInnerHTML[]

 2. determines:
   tdToAlignLyrics[]
   tdToAlignChord[]
   noteCenterXForLyrics[]
   noteCenterXForChord[]
   numNoteLines: total number of note lines
-------------------------------------------*/
var numNoteLines = 0;
var noteLineInnerHTML = [];
var noteCenterXForLyrics = [];  //valid indexing starts with [1]
var noteCenterXForChord = [];  //valid indexing starts with [1]
var tdToAlignLyrics = [];  //valid indexing starts with [1]
                           //1 <td> lyrics can align this <td>
                           //0 <td> is a space or sharp/flat
var tdToAlignChord = [];  //valid indexing starts with [1] 
                          //1 <td> chord can align this <td>
                          //0 <td> is sharp/flat
var noteLinePos2TD = [];  //convert jpContents position to TD index
var noteLineStartCursor = [];  //including '$' position, starts with [1]
/*======================================================================
   noteLineStartCursor[1]=3 in 'AAA$BBB\nCCCCC\nDDDDDDD$EEEEEEE'
                                     ^Position[i-1]
                                      |<- length[i-1] ->|
                                                         ^Position[i]
======================================================================*/
function preProcessNoteLines() {
  var s=' ';
  var octave = 0;
  var underline = 0;
  var t = t4[fontColorNum];
  var c = '';

  var noteString;
  var noteLines = jpContents.split('$');

  noteLineStartCursor = [-1];  //init
  for (var i=1;i<noteLines.length;i++) {
    noteLineStartCursor[i] = 
      noteLineStartCursor[i-1] + noteLines[i-1].length + 1;  //+1='$'
  }

  numNoteLines = noteLines.length - 1;

  noteLineInnerHTML = [];
  noteCenterXForLyrics = [];
  noteCenterXForChord = [];
  tdToAlignLyrics = [];
  tdToAlignChord = [];
  noteLinePos2TD = [];

  //to process BBB and DDD in 'AAA$BBB\nCCCC$DDD', so skip iNoteLine=0
  for (var iNoteLine = 1; iNoteLine < noteLines.length; iNoteLine ++) {
   ePreRenderArea.innerHTML = '';  //clear pre-render area
   tdToAlignLyrics[iNoteLine] = [];
   tdToAlignChord[iNoteLine] = [];
   noteCenterXForChordOccupied[iNoteLine] = [];
   noteCenterXForLyricsOccupied[iNoteLine] = [];

   s = noteTableBegin(iNoteLine);

   noteString = noteLines[iNoteLine];  //=BBB\nCCCC, DDD
   var iTD = 0;  //init on every note line
   var cursorID = 0;
   noteLinePos2TD[iNoteLine] = [0];  //[0] is for '$'
   for (var i=0;i<noteString.length;i++) {

    noteLinePos2TD[iNoteLine][i+1] = iTD;  //[0] is for '$'
    cursorID = noteLineStartCursor[iNoteLine] + i + 1;  //+1 for '$'

    c = noteString[i];
    if (c === '\n') {
      noteLinePos2TD[iNoteLine][i+1] = 999;  //999 means end of the line
      s += noteTableEnd();  //</tr></table>
      ePreRenderArea.innerHTML = s;  //flush s into innerHTML
      noteLineInnerHTML[iNoteLine] = s;  //save for rendering use
      buildAlignmentPosition(iNoteLine);
      //skip all other chars after \n
      break;  //exit for
    }

    switch (c) {
      case '{':
        //moved to phase 2
      break;
      case '}':
        //moved to phase 2
      break;
      case '(':
        if (underline<2) {underline ++;}
      break;
      case ')':
        if (underline>0) {underline --;}
      break;
      case '^':
        octave = 1;
      break;
      case 'v':
        octave = -1;
      break;
      case 'b': case '#': case '%':
        tdToAlignLyrics[iNoteLine].push(0);
        tdToAlignChord[iNoteLine].push(0);
        iTD++;
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
        if (c==='#') {
          s += tdBegin(cursorID) + sharp1 + t + sharp2;
        }
        else if (c==='b') {
          s += tdBegin(cursorID) + flat1 + t + flat2;
        }
        else if (c==='%') {
          s += tdBegin(cursorID) + natural1 + t + natural2;
        }
      break;
      case '0': case '1': case '2': case '3':
      case '4': case '5': case '6': case '7':
        tdToAlignLyrics[iNoteLine].push(1);
        tdToAlignChord[iNoteLine].push(1);
        iTD++;
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
            s += tdBegin(cursorID) + noteBegin() + hi1 + n + c + t + lo0;
            break;
          case 0:
            s += tdBegin(cursorID) + noteBegin() + hi0 + n + c + t + lo0;
            break;
          case -1:
            s += tdBegin(cursorID) + noteBegin() + hi0 + n + c + t + lo1;
            break;
        }
        octave = 0;  //reset octave only after note is rendered
      break;
      case '-':
        tdToAlignLyrics[iNoteLine].push(1);  //lyrics can align '-'
        tdToAlignChord[iNoteLine].push(1);  //chord can align '-'
        iTD++;
        s += tdBegin() + dash;
      break;
      case '.':
        tdToAlignLyrics[iNoteLine].push(0);
        tdToAlignChord[iNoteLine].push(1);  //chord can align '.'
        iTD++;
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
        s += tdBegin() + hi0 + dot + '<b>·</b>' + t + lo0;
      break;
      case '_':  //small gap for all t4/t8/t16 notes
        tdToAlignLyrics[iNoteLine].push(0);
        tdToAlignChord[iNoteLine].push(1);  //chord can align '_'
        iTD++;
        s += tdBegin(cursorID) + t4Space;
      break;
      case ' ':  //for underline through
        tdToAlignLyrics[iNoteLine].push(0);
        tdToAlignChord[iNoteLine].push(1);  //chord can align ' '
        iTD++;
        switch (underline) {
          case 0:
            s += tdBegin(cursorID) + t4Space;
          break;
          case 1:
            s += tdBegin(cursorID) + t8Space[fontColorNum];
          break;
          case 2:
            s += tdBegin(cursorID) + t16Space[fontColorNum];
          break;
        }
      break;
      case '|':
        tdToAlignLyrics[iNoteLine].push(0);
        tdToAlignChord[iNoteLine].push(0);
        iTD++;
        s += tdBegin(cursorID) + bar[fontColorNum];
        underline = 0;  //reset time underline whenever new bar
      break;
      case ']':
        tdToAlignLyrics[iNoteLine].push(0);
        tdToAlignChord[iNoteLine].push(0);
        iTD++;
        s += tdBegin(cursorID) + songEnd[fontColorNum];
        underline = 0;  //reset time underline whenever new bar
      break;
      default:
        tdToAlignLyrics[iNoteLine].push(0);
        tdToAlignChord[iNoteLine].push(0);
        iTD++;
        s += tdBegin(cursorID) + hi0 + n + c + t4[fontColorNum] + lo0;
      break;
    }//switch c

   }//for (var i=0;i<noteString.length;i++)


   if (i<noteString.length) {
     //(c === '\n')
     //s has been flushed into innerHTML
   }
   else {
     //last char has been reached, flush s into innerHTML
     s += noteTableEnd();  //</tr></table>
     ePreRenderArea.innerHTML = s;  //flush s into innerHTML
     noteLineInnerHTML[iNoteLine] = s;  //save for rendering use
     buildAlignmentPosition(iNoteLine);
     //break;  //the last i will break for sure
   }

  }//for (var iNoteLine = 1; iNoteLine < noteLines.length; iNoteLine ++)

}//function

var noteCenterXForChordOccupied = [];
var noteCenterXForLyricsOccupied = [];

var jpContentCursor2LineIndex = [];  //[c]=line number index
var jpContentCursor2Mode = [];  //[c]=mode
var jpContentCursor2ModeIndex = [];  //[c]=mode index

var lyricCursorPos = [];
/*--------------------------------
 render actual HTML
--------------------------------*/
function buildJPContentsHTML() {
  var s=' ';
  var mode = '';  //init mode
  var c = '', next_c = '';

  var iLyricsChar = 0;  //index of lyrics characters
  var iChordChar = 0;  //index of chord groups
  var p1=0, p2=0;
  var lastLyricCenterPosition = -lyricsSizeNum/2;  //the last lyrics character's position
  var lastChordCenterPosition = -chordSizeNum/2;  //the last lyrics character's position

  var targetNoteLine = 0;  //starts with [1]
  var targetChordLine = 0;  //starts with [1]
  var targetFreetextLine = 0;  //starts with [1]
  var targetLyricsLine = 0;  //starts with [1]

  noteCenterXForChordOccupied = [];
  noteCenterXForLyricsOccupied = [];
  jpContentCursor2LineIndex = [];
  jpContentCursor2Mode = [];
  jpContentCursor2ModeIndex = [];
  lyricCursorPos = [];

  //eRenderArea.innerHTML = '';  //clear output window
  eRenderArea.innerHTML = '<span id="cursor_div"></span>';  //init

  preProcessNoteLines();  //eRenderArea must be cleared
  preProcessChordLines();

  var lineIndex = 0;
  for (var i=0;i<jpContents.length;i++) {

    jpContentCursor2LineIndex[i] = lineIndex;

    c = jpContents[i];
    switch (mode) {
    case '':
      //start of a new line, mode is not decided
      //decide mode by [i] and [i+1]
      switch (c) {
        case '$':  //note mode line starts with '$'
          mode = 'note';
          targetNoteLine ++;
          //s = noteTableBegin();  //??? there are other 's =' to be removed

          jpContentCursor2Mode[i] = '$';
          jpContentCursor2ModeIndex[i] = targetNoteLine;
          continue;  //proceed to next i
        break;
        case '@':  //chord mode line starts with '@'
          if (targetChordLine < numNoteLines) {
            //enter chord mode only when there is targetNoteLine
            mode = 'chord';
            targetChordLine ++;
            s = chordBegin + 'height:' + calculateLineHeight(chordSizeNum) + 'px;' +
'font-family:'+ noteFont + ';' +
'font-size:' + chordSize + 'px;' + '">';
            iChordChar = 0;
            p1 = 0;  //init at beginning of lyrics line
            lastChordCenterPosition = -100;  //don't care lastChord position

            jpContentCursor2Mode[i] = '@';
            jpContentCursor2ModeIndex[i] = targetChordLine;
          }
          else {
            //treated as freetext when there is no targetNoteLine
            mode = 'freetext';
            targetFreetextLine ++;
            s = freetextBegin + 'height:' + calculateLineHeight(lyricsSizeNum) + 'px;">';

            jpContentCursor2Mode[i] = '/';
            jpContentCursor2ModeIndex[i] = targetFreetextLine;
          }
          continue;  //skip '@' to next [i]
        break;
        case '/':
          mode = 'freetext';
          targetFreetextLine ++;
          jpContentCursor2Mode[i] = '/';
          jpContentCursor2ModeIndex[i] = targetFreetextLine;
          if ((i+1) < jpContents.length) {
            //there are characters after [i]
            next_c = jpContents[i+1];
          }
          else {
            //no further [i], continue will terminate for loop
            continue;  //proceed to next i (= terminate for loop)
          }

          if (next_c === '1') {
            //freetext1
            s = freetextBegin + 'height:' + calculateLineHeight(text1SizeNum) + 'px;' +
              'font-family:'+ converChineseFontFamily(text1Font) + ';' +
              'font-size:' + text1Size + 'px;' +
              '">';
            i++;  //skip next_c and proceed to next i
            jpContentCursor2Mode[i] = '/';
            jpContentCursor2ModeIndex[i] = targetFreetextLine;
            continue;
          }
          else if (next_c === '2') {
            //freetext2
            s = freetextBegin + 'height:' + calculateLineHeight(text2SizeNum) + 'px;' +
              'font-family:'+ converChineseFontFamily(text2Font) + ';' +
              'font-size:' + text2Size + 'px;' +
              '">';
            i++;  //skip next_c and proceed to next i
            jpContentCursor2Mode[i] = '/';
            jpContentCursor2ModeIndex[i] = targetFreetextLine;
            continue;
          }
          else {
            //freetext0
            s = freetextBegin + 'height:' + calculateLineHeight(lyricsSizeNum) + 'px;">';
            continue;  //skip "/"
          }
          //continue;  //dummy continue
        break;
        default:
          if (targetNoteLine > 0) {
            //lyrics mode only when there is targetNoteLine
            mode = 'lyrics';
            targetLyricsLine ++;
            lyricCursorPos[targetLyricsLine] = [];
            jpContentCursor2Mode[i] = 'l';
            jpContentCursor2ModeIndex[i] = targetLyricsLine;
            s = lyricsBegin(targetLyricsLine) + 'height:' + calculateLineHeight(lyricsSizeNum) + 'px;">';
            iLyricsChar = 0;
            p1 = 0;  //init at beginning of lyrics line
            lastLyricCenterPosition = -lyricsSizeNum/2;
          }
          else {
            //treated as freetext when there is no targetNoteLine
            mode = 'freetext';
            targetFreetextLine ++;
            jpContentCursor2Mode[i] = '/';
            jpContentCursor2ModeIndex[i] = targetFreetextLine;
            s = freetextBegin + 'height:' + calculateLineHeight(lyricsSizeNum) + 'px;">';
          }

          //current c should be rendered, so move backward and continue
          i--;
        break;
      }//switch (c)






  break;
  case 'note':
            jpContentCursor2Mode[i] = '$';
            jpContentCursor2ModeIndex[i] = targetNoteLine;
    switch (c) {
      case '\n':  //end of note line
        eRenderArea.innerHTML += noteLineInnerHTML[targetNoteLine];        
        mode = '';  //reset mode at new line
        lineIndex ++;
      break;
      default:
      break;
    }//switch (c)
  break;//case 'note'




/*********************************************
   adaptive chord positioning
              +--------------+
              |   <td> note  |
              +--------------+
                      ^noteCenterXForChord[iChordChar]=p1
+--------------------++----------------+
|                    ||                |
|   previous chord   || current chord  |  max(p1,p2)=p2, use whichever larger
|<-prev chord size ->||                |  if we use smaller p1, char 2 will overlap char 1
+--------------------++----------------+
           ^                  ^p2= lastChordCenterPosition + a + b
           lastChordCenterPosition

           |<-  a  ->| = 1/2 previous chord size
                      |<- b ->| = 1/2 current chord size

*********************************************/
  case 'chord':
            jpContentCursor2Mode[i] = '@';
            jpContentCursor2ModeIndex[i] = targetChordLine;
    switch (c) {
      case '\n':  //the only way to exit lyrics mode is new line
        lineIndex ++;
        var targetNoteLineForChord = targetNoteLine + 1;
        var prevChordWidth = 0;
        for (var j=0;j<chordLineChords[targetChordLine].length;j++) {
          var cc = chordLineChords[targetChordLine][j];
          //p1: note center position
          //p2: chords line-up center position
          if (iChordChar < noteCenterXForChord[targetNoteLineForChord].length) {
            //there is note to align
            p1 = noteCenterXForChord[targetNoteLineForChord][iChordChar];
          
            if (cc === '') {
              //original chord is ' ', only for advancing index to the next note
              //no <span> output

              //record for tab symbol display
              noteCenterXForChordOccupied[targetNoteLineForChord][iChordChar] = 0;
            }
            else {
              const currentChordWidth = chordLineChordWidth[targetChordLine][iChordChar];
              p2 = lastChordCenterPosition + (prevChordWidth + currentChordWidth) / 2;

              lastChordCenterPosition = Math.max(p1,p2);

              //chordPositionOffset = - (currentChordWidth / 2) + renderAreaPadding;
              chordPositionOffset = - (currentChordWidth / 2);

              s += '<span class="ly" style="left:' +
(lastChordCenterPosition + chordPositionOffset) + 'px;">' + cc + '</span>';
              prevChordWidth = currentChordWidth;

              //record for tab symbol display
              noteCenterXForChordOccupied[targetNoteLineForChord][iChordChar] = 1;
            }

            iChordChar ++;
          }
          else {
            //chord count is more than notes, ignore
          }



        }//for j

        s += chordEnd;  //</div>
        eRenderArea.innerHTML += s;  //finish lyrics mode and flush s into innerHTML
        s = '';  //clear s to disable output s at the end of this function
        mode = '';  //reset mode at new line
      break;
      default:
      break;
    }//switch (c)
  break;//case 'chord'

  case 'lyrics':
    jpContentCursor2Mode[i] = 'l';
    jpContentCursor2ModeIndex[i] = targetLyricsLine;
    switch (c) {
      case '\n':  //the only way to exit lyrics mode is new line
        lineIndex ++;
        s += lyricsEnd;  //</div>
        eRenderArea.innerHTML += s;  //finish lyrics mode and flush s into innerHTML
        s = '';  //clear s to disable output s at the end of this function
        mode = '';  //reset mode at new line
      break;



/*********************************************
   adaptive lyrics positioning
              +--------------+
              |   <td> note  |
              +--------------+
                      ^noteCenterXForLyrics[targetNoteLine][iLyricsChar]=p1
+----------------++----------------+
|                ||                |
|     char 1     ||     char 2     |  max(p1,p2)=p2, use whichever larger
|<- lyricsSize ->||                |  if we use smaller p1, char 2 will overlap char 1
+----------------++----------------+
         ^                ^p2
          lastLyricCenterPosition

         |<- lyricsSize ->|


                                            ' '                   normal char
iLyricsChar < noteCenterXForLyrics.length    p1=tdCenter[+1]       p1=tdCenter[+1]
                                            p2=p2+2(small gap)    p2=last+size

iLyricsChar >= noteCenterXForLyrics.length   p2=last+size          p2=last+size

*********************************************/
      default:  //lyrics characters

        //p1: note center position
        //p2: lyrics line-up center position
        if (iLyricsChar < noteCenterXForLyrics[targetNoteLine].length) {
          //there is note to align
          p1 = noteCenterXForLyrics[targetNoteLine][iLyricsChar];
        
          if (c===' ') {
            //' ' is only for advancing index to the next note ???full-space
            //no <span> output to the HTML
            //lastLyricCenterPosition remains the same
  
            //s += '';
            //lastLyricCenterPosition = lastLyricCenterPosition;
            lyricCursorPos[targetLyricsLine][iLyricsChar] = p1 - lyricsCenter2LeftOffset;

            //record for tab symbol display
            //noteCenterXForLyricsOccupied[targetNoteLine][iLyricsChar] = 0;
          }
          else {
            p2 = lastLyricCenterPosition + lyricsSizeNum;  //=span.ly{font-size:36px;}
            lastLyricCenterPosition = Math.max(p1,p2);
            s += '<span class="ly" style="left:' +
(lastLyricCenterPosition - lyricsCenter2LeftOffset) + 'px;">' + c + '</span>';

            //cursor pos is on the right-hand side of the lyrics
            lyricCursorPos[targetLyricsLine][iLyricsChar] = lastLyricCenterPosition - lyricsCenter2LeftOffset;

            //record for tab symbol display
            noteCenterXForLyricsOccupied[targetNoteLine][iLyricsChar] = 1;
          }

          iLyricsChar ++;
        }
        else {
          //lyrics count is more than notes, ignore
        }

      break;
    }//switch c
  break;//case 'lyrics'


  case 'freetext':  //no alignment to notes
  default:
            jpContentCursor2Mode[i] = '/';
            jpContentCursor2ModeIndex[i] = targetFreetextLine;
    switch (c) {
      case '\n':  //the only way to exit this mode is new line
        lineIndex ++;
        s += freetextEnd;
        eRenderArea.innerHTML += s;  //finish lyrics mode and flush s into innerHTML
        s = '';  //clear s to disable output s at the end of this function
        mode = '';  //reset mode at new line
      break;
      case ' ':
        s += '&nbsp;';
      break;
      default:
        s += c;
      break;
    }//switch c
  break;//case 'freetext'




  }//switch mode

  }//for

  //if end of jpContents is not \n, output anyway
  if (mode === 'note') {
    eRenderArea.innerHTML += noteLineInnerHTML[targetNoteLine];

    //for cursor at the end of line
    jpContentCursor2Mode[i] = jpContentCursor2Mode[i-1];
    jpContentCursor2ModeIndex[i] = jpContentCursor2ModeIndex[i-1];
    jpContentCursor2LineIndex[i] = jpContentCursor2LineIndex[i-1];
  }
  else if (s.length>0) {
    eRenderArea.innerHTML += s;  //flush s when s is not empty
  }

  renderSlur();
}

/*--------------------------------
 render slur
--------------------------------*/
function renderSlur() {
  // ==========================================
  // re-visit whole user string to add slurs/triplets on rendered HTML
  // ==========================================
/* slur structure = preSpan+slur

     |    preSpan   |   slur  |        preSpan         |     slur     |
     |<td>|<td>|<td>|<td>|<td>|<td>|<td>|<td>|<td>|<td>|<td>|<td>|<td>|

*/
  var iTD = 0;  //<td> index for adding slur
  var preSpan = 0;  //init
  var tr0;
  var slurEnd=0;
  var slurBegin=0;
  var ss;
  var table;

  var mode = '';  //init mode
  var noteTable = 0;
  for (var i=0;i<jpContents.length;i++) {
    const c= jpContents[i];

    //init mode
    if (mode=='') {
      if (c=='$') {  //note mode line starts with '$'
        mode = 'note';
        iTD = 0;  //reset iTD at new line
        preSpan = 0;  //reset preSpan

        table = document.getElementsByClassName('nt')[noteTable];
        tr0 = table.getElementsByTagName('tr')[0];  //[0] is r1 for slur
        tr0.innerHTML = '';
        ss = '';
        noteTable ++;
        continue;  //proceed to next c
      }
      else {
        mode = 'lyrics';
      }
    }

    switch (mode) {
    case 'note':
      switch (c) {
        case '(':  case ')':  case '^':  case 'v':
          //no <td> is used
        break;
        case '{':
          slurBegin = iTD;
        break;
        case '}':
          slurEnd = iTD;
          if ((slurBegin-preSpan)>0) {
            ss += preSpan1 + (slurBegin-preSpan) + preSpan2 ;
          }
          if ((slurEnd-slurBegin)>7) {
            ss += slur1 + (slurEnd-slurBegin) + slur2_long[fontColorNum];
          }
          else if ((slurEnd-slurBegin)>0) {
            ss += slur1 + (slurEnd-slurBegin) + slur2_short[fontColorNum];
          }
  
          //tr0.innerHTML += ss;
          preSpan = slurEnd;
        break;
        case '\n':
          tr0.innerHTML = ss;  //flush the ss into HTML at the end of line
          mode = '';  //reset mode at new line
        break;
        default:
          iTD ++;
        break;
      }//switch c
    break;//case 'note'

    case 'lyrics':
    default:
      switch (c) {
        case '\n':  //the only way to exit lyrics mode is new line
          mode = '';  //reset mode at new line
        break;
        default:
        break;
      }//switch c
    break;//case 'lyrics'
    }//switch mode

  }//for

}//function

//confirmed: no need to remove previous added event listeners
//var done=false;
//================================
// render area mouse click event
//================================
function setCursorEventOnEachNote() {
//  if (done) {return;}
//  done = true;

  var tables = eRenderArea.getElementsByClassName('nt');  //avoid pre-render
  for (var i=0;i<tables.length;i++) {
    var t = tables[i];
    t.addEventListener('click', function(e) {
      // check if target is inside table
      const td = e.target.closest('td');
      if (!td) return;  //???? when will trigger this condition?
      //alert(td.id);

      var tdIdNum = Number(td.id);
      if (tdIdNum) {

  var rect = td.getBoundingClientRect();
  var x = e.clientX - rect.left; //x position within the element.
  //var y = e.clientY - rect.top;  //y position within the element.
  if (x/td.offsetWidth>0.5) {
    //click on the right side, locate next <td>
    tdIdNum ++;  //???? should get the id of next <td> 
  }

        eJPContents.selectionStart = tdIdNum;
        eJPContents.selectionEnd = tdIdNum;
        cursor();
        eJPContents.focus();
      }
    }, false);
  }//for
}

function setCursorEventOnEachLyricChar() {
  var ds = eRenderArea.getElementsByClassName('lyrics_div');
  for (var i=0;i<ds.length;i++) {
    var d = ds[i];
    d.addEventListener('click', function(e) {
      const div = e.target.closest('div');
      var rect = div.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      //alert(div.id + '/' + x);
      var lyricsLineNum = Number(div.id.split('L')[1]);

//debug
for (var j=0;j<lyricCursorPos[lyricsLineNum].length;j++) {
   div.innerHTML += '<span class="cursor_div" style="left:' + 
lyricCursorPos[lyricsLineNum][j] + 
'px;"></span>';
}



    }, false);
  }//for
}



//==================
// file functions
//==================

//build open file list
function updateFileList() {

  //clear the options
  eOpenFileSelect.innerHTML = '';  //simplest way to clear options

  //create a dummy label option
  var opt = document.createElement('option');
  opt.value = defaultFileSelectElementValue;
  opt.disabled = true;
  opt.innerHTML = eOpenFileSelect.getAttribute('name');  //'- open file -';
  eOpenFileSelect.appendChild(opt);

  //create a demo entry option
  opt = document.createElement('option');
  opt.value = demoStorageKey;
  opt.innerHTML = sDemoFile;
  eOpenFileSelect.appendChild(opt);

  if (0) {  //not working
  //create a load PC file entry option
  opt = document.createElement('option');
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
      opt = document.createElement('option');
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
  var editedLabel='';
  if (notSaved) {
    editedLabel = sEdited;
  }
  if (userFilename === '') {
    //no name document
    eFilenameSpan.innerHTML = sUnnamed + editedLabel;
    eDeleteButton.style.visibility = 'hidden';
  }
  else {
    //valid file name
    eFilenameSpan.innerHTML = userFilename + editedLabel;
    eDeleteButton.style.visibility = 'visible';  //only valid files can be deleted
  }
  localStorage.setItem(userFilenameStorageKey,userFilename);  //save current filename
}





//===========================
// parse raw file structure
//===========================
const configSeparatorTag = '%CONFIG%';
var rawFileString = '';  //for import and open file
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
const ePCFileInput = document.getElementById('pcFileInput');
ePCFileInput.addEventListener('change', function () {
  importFile();
}, false);

document.getElementById('import').addEventListener('click', function () {
  ePCFileInput.click();
}, false);

function importFile() {
  var file, fr;

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
eOpenFileSelect.addEventListener('change', function () {
  if (askUserToConfirmRemovingContents()) {
    //update userFilename
    if (eOpenFileSelect.value === demoStorageKey) {
      //special file: demo file
      userFilename = '';
    }
    else {
      userFilename = 
        eOpenFileSelect.options[eOpenFileSelect.selectedIndex].text;
      //alert('open file: '+ userFilename);
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

document.getElementById('save').addEventListener('click', function () {
  //prompt for filename
  var filenameInput = prompt(sInputSaveFilename, userFilename);

  if (filenameInput === null) {
    //user press cancel
  }
  else {
    filenameInput = filenameInput.replace(/(\r\n|\n|\r)/gm, '');  //remove cr/lf
    filenameInput = filenameInput.trim();  //remove extra spaces
    if (filenameInput != '') {
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

  userFilename = '';
  notSaved = false;  //notSaved need to be set before next function
  updateUserFilenameDisplayAndLocalStorage();
}
document.getElementById('new_file').addEventListener('click', function () {
  if (askUserToConfirmRemovingContents()) {
    newFile();
  }
}, false);


//==================
// delete
//==================
eDeleteButton.addEventListener('click', function () {
  if (userFilename === '') {
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
eJPContents.addEventListener('input', function () {
  jpContents = eJPContents.value;
  buildJPContentsHTML();
  setCursorEventOnEachNote();
  setCursorEventOnEachLyricChar();
  drawTab();
  if (!notSaved) {
    //it was saved, now it is edited
    markNotSaved();
  }
  eConfigTextArea.value = debugWatchValue;
}, false);

var cursorPos = 0;
function cursor() {
  var cursorDiv = document.getElementById('cursor_div');
  cursorDiv.style.visibility = 'hidden';
  if (!showCursor) {
    return;
  }

  cursorPos = eJPContents.selectionStart;
  var mode = jpContentCursor2Mode[cursorPos];
  var modeIndex = jpContentCursor2ModeIndex[cursorPos];
  var relativeCursorPosition = cursorPos - noteLineStartCursor[modeIndex];
  eConfigTextArea.value = cursorPos + 
'(' + jpContentCursor2LineIndex[cursorPos] +
',' + relativeCursorPosition +
') ' + mode +
':' + modeIndex;

  switch (mode) {
    case '$':
/*
               $   1   2   3
               ^noteLineStartCursor=0
               |   |   |   |
r-cursor pos:  0   1   2   3
noteLinePos2TD 0   0   1   2
*/
      var table = document.getElementsByClassName('nt')[modeIndex-1];
      var tr = table.getElementsByTagName('tr')[1];
      var td;
      if (relativeCursorPosition >= 0) {
        var iTD = noteLinePos2TD[modeIndex][relativeCursorPosition];
        if (iTD < 999) {
          td = tr.getElementsByTagName('td')[iTD];
          //cursorDiv.style.left = (table.offsetLeft + td.offsetLeft) + 'px';
          cursorDiv.style.left = (table.parentNode.offsetLeft + td.offsetLeft) + 'px';
        }
        else {
          //iTD === 999, at the end of the line
          td = tr.getElementsByTagName('td');
          td = tr.getElementsByTagName('td')[td.length-1];  //last td
          //cursorDiv.style.left = (table.offsetLeft + td.offsetLeft + td.offsetWidth) + 'px';
          cursorDiv.style.left = (table.parentNode.offsetLeft + td.offsetLeft + td.offsetWidth) + 'px';
        }

        //cursorDiv.style.top = (table.offsetTop + tr.offsetTop - 5) + 'px';
        cursorDiv.style.top = (table.parentNode.offsetTop + tr.offsetTop - 5) + 'px';

        cursorDiv.style.visibility = 'visible';
      }
//???
    break;
  }
  
}
eJPContents.addEventListener('keypress', cursor); // normal keys, not cursor keys
//eJPContents.addEventListener('mousedown', cursor); // Click down
eJPContents.addEventListener('mouseup', cursor); // Click down
eJPContents.addEventListener('touchstart', cursor); // Mobile
eJPContents.addEventListener('input', cursor); // Other input events
eJPContents.addEventListener('paste', cursor); // Clipboard actions
eJPContents.addEventListener('cut', cursor);
//eJPContents.addEventListener('mousemove', cursor); // Selection, dragging text
eJPContents.addEventListener('select', cursor); // Some browsers support this event
eJPContents.addEventListener('selectstart', cursor); // Some browsers support this event
//for cursor keys
//document.addEventListener("keydown",cursor,false);
document.addEventListener("keyup",cursor,false);  //keyup decides final cursor position




//==================================
// export jpContents as a text file
//==================================
const eExportButton = document.getElementById('export');

function exportContentsAsFile() {
  var textFileAsBlob = new Blob([ jpContents + configSeparatorTag + configString ], { type: 'text/plain' });
  var fileNameToSaveAs = userFilename + '.ksjp.txt';  //filename.extension

  var downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = 'Download File';
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = function (e) {
      document.body.removeChild(e.target);
    };
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
}
eExportButton.addEventListener('click', exportContentsAsFile);



//==================
// web page closed
//==================
window.onbeforeunload = function() {
  if (clearStorageFlag) {
    return;
  }
  //convert logic to string to save notSaved state
  localStorage.setItem(notSavedFlagStorageKey, (notSaved?'true':'false'));

  //save current filename
  localStorage.setItem(userFilenameStorageKey, userFilename);

  //save current editing contents
  localStorage.setItem(tempContentsStorageKey, eJPContents.value);

  //save current editor config
  localStorage.setItem(tempConfigStorageKey, configString);
};





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
  userFilename = '';
}

//4. restore notSaved flag and then update userFilename
var notSavedStr = localStorage[notSavedFlagStorageKey];
if (notSavedStr === undefined) {
  //first time usage
  notSaved = false;
}
else {
  notSaved = (notSavedStr === 'true' ? true:false);  //convert string to logic
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



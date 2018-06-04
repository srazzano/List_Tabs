// ==UserScript==
// @name                 List Tabs
// @version              1.0
// @description          Generates a numbered list of tabs by name
// ==/UserScript==

(function() { 

  "use strict";

  var {classes: Cc, interfaces: Ci, utils: Cu} = Components;

  const loc = navigator.language,
        pb = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).QueryInterface(Ci.nsIPrefBranch);

  pref.root = "browser.List_Tabs.";

  pref.defaults = {
    btnImage: "list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACxklEQVR42u2VTWjTYBjH/0k/VpPOzuhwdnQfLQy8DBxqLx46PG4OB9bpUUXBmydFEA8yGHibIIKgXgRhRQVFEAQVHIKbIogignPOIbV1tnZt+pF+xCRdamLaNUlbvfi/vE36vO/v977vU0pAEWqSnxGGIPQnlD5HHDRQrwmhhHfRheA31qp7slAPob4hCaUAb3YRQUBcRzy5GR3lomxIIyCEX/qybBje2+ORFw0K8+ten1AfWhMINVVAmKtn98o5xH8BpYDUQH9ZQGpGUUDufkOLKBYTFzI8T44kYGbnRjLv3y2Nu17MaU6i5QIyXI5SouUCnxcX8P3QYc17WaKlAiJcTi0JlcCN69ekL44cPSaN8rPZDA8HVM/VJA6Ew7UFFj8t1GPUjD8ZQD5H4nXn45oSmhNoVtzve5FJAHSH8OvO85h1PtVItKwHtr7zIpcsgHIRIIslpFIEKKcVz+lHlZq+fl/lc1MFVHBegK+KcBuyaQ7sqgMffA9VcI1AI014Zs8VcLEoHE4SpIVHOsHDuZFHNgMk4w5Eey7izmysUi8z1hXQ24T+wgTy8QjaaAusZLG8c1f5L0YUWe6/jRWWUc3p9/qacwXM4jj46EsVXN55IU9giZmGa2C85vyGBER4KfJKOvY/4fKxrwdvSKAanKJs4PKcbrhGQG8THt/7Ea7oTdg2WGCzFJFM/Ian4gQiPdOqhqsW0024zT6H7vDpMtwqwH8SoB1WcCiAjfFY2XIKEef+ujs33YSb5z0SPNZ+r/JuU2If2HgJq/QYyJ2XDV2lYYGut30qOJMcQzpeRNoyBHboFtocVGsF7EtvcP/JLE6cn0L42QNQX0fAcm7EBu+inXEbgmsE9DShm8xJ8KsXzmJiYArJ4g788E6io3vQMLyuQLUmDAQCGBkdxaWT48jYaWQpBp2e7abgpq6g2akI/BP6Wn4BX+6jGMVbnr4AAAAASUVORK5CYII=')",
    btnLabel: "List Tabs",
    btnTip: "Generate a numbered list of tabs by name",
    exe: "C:\\Windows\\System32\\notepad.exe",
    fileName: "Tab List",
    fileUnique: true,
    fileTimestamp: true,
    generated: "Tabs Generated On",
    symbol: "@"
  }

  for (let key in pref.defaults) {
    if (pref.defaults.hasOwnProperty(key)) {
      let val = pref.defaults[key];
      switch (typeof val) {
        case "boolean":
          pb.getDefaultBranch(pref.root).setBoolPref(key, val);
          break;
        case "string":
          pb.getDefaultBranch(pref.root).setCharPref(key, val);
  } } }

  function pref(key) {
    let {branch, defaults} = pref;
    if (branch == null) branch = pb.getBranch(pref.root);
    switch (typeof defaults[key]) {
      case "boolean": return branch.getBoolPref(key);
      case "string": return branch.getCharPref(key);
    }
    return null;
  }

  function gCV(aKey, aBranch) { return pb.getStringPref(!aBranch ? pref.root + aKey : aKey) }

  function timestamp() {
    let date = new Date(),
        options = { year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    return date.toLocaleDateString(loc, options).replace(",", " " + pref("symbol"));
  }

  function unique() {
    let date = new Date(), year = date.getFullYear() - 2000, month = date.getMonth() + 1, day = date.getDate(),
        hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds();
    month < 9 ? month = "0" + month : month = month;
    day < 9 ? day = "0" + day : day = day;
    hour < 10 ? hour = "0" + hour : hour = hour;
    minute < 10 ? minute = "0" + minute : minute = minute;
    second < 10 ? second = "0" + second : second = second;
    return year + month + day + hour + minute + second;
  }

  function listTabs(e) {
    if (e.button === 0) {
      let app = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile),
          conv = Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream),
          fos = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream),
          fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker),
          proc = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess),
          list = [], args, exe = pref("exe"), indent, lab, out, stamp, str, unq,
          tabs = gBrowser.tabContainer.childNodes;
      if (tabs.length < 10) {
        for (let i = 0; i < tabs.length; i++) list.push("(" + (i+1) + ") " + tabs[i].label.replace(/,/g, "`"));
      } else if (tabs.length > 9 && tabs.length < 99) {
        for (let i = 0; i < tabs.length; i++) {
          lab = tabs[i].label.replace(/,/g, "`");
          if (i < 9) indent = " (";
          else if (i > 8 && i < 99) indent = "(";
          list.push(indent + (i+1) + ") " + lab);
        }
      } else {
        for (let i = 0; i < tabs.length; i++) {
          lab = tabs[i].label.replace(/,/g, "`");
          if (i < 9) indent = "  (";
          else if (i > 8 && i < 99) indent = " (";
          else indent = "(";
          list.push(indent + (i+1) + ") " + lab);
      } }
      if (pref("fileTimestamp") || pref("fileUnique")) stamp = unique();
      pref("fileTimestamp") ? str = tabs.length + " " + gCV("generated") + " " + timestamp() + " (" + stamp + ")\n\n" : str = "";
      pref("fileUnique") ? unq = gCV("fileName") + " " + stamp : unq = gCV("fileName");
      out = str + list.toString().replace(/,/g, "\n").replace(/`/g, ",");
      fp.init(window, "Save", fp.modeSave);
      fp.defaultString = unq;
      fp.defaultExtension = "txt";
      fp.appendFilters(fp.filterText);
      fp.open(function (evt) {
        if (evt == fp.returnOK || evt == fp.returnReplace) {
          if (fp.file.exists()) fp.file.remove(true);
          fp.file.create(Ci.nsIFile.NORMAL_FILE_TYPE, 420);
          fos.init(fp.file, 0x02, 0x200, false);
          conv.init(fos, "UTF-8", 0, 0);
          conv.writeString(out);
          conv.close();
          args = [fp.file.path];
          app.initWithPath(exe);
          proc.init(app);
          proc.run(false, args, args.length);
        }
      });
  } }

  try {
    CustomizableUI.createWidget({
      id: "list-tabs",
      type: "custom",
      onBuild: function(aDoc) {
        let btn = aDoc.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "toolbarbutton");
        btn.onclick = event => listTabs(event);
        var props = {
          id: "list-tabs",
          class: "toolbarbutton-1 chromeclass-toolbar-additional",
          label: gCV("btnLabel"),
          style: pref("btnImage"),
          tooltiptext: gCV("btnTip")
        };
        for (let p in props) btn.setAttribute(p, props[p]);
        return btn;
      }
    });
  } catch(e) {};

})();

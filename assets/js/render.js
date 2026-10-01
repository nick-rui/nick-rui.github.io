// Renders the Research and Math sections from JSON in assets/data/.
// To add an entry, edit the JSON file -- nothing here needs to change.

function link(url, text, className) {
  var a = document.createElement('a');
  a.href = url;
  if (className) {
    var span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    a.appendChild(span);
  } else {
    a.textContent = text;
  }
  return a;
}

function titleNode(paper) {
  if (paper.url) return link(paper.url, paper.title, 'papertitle');
  var span = document.createElement('span');
  span.className = 'papertitle';
  span.textContent = paper.title;
  return span;
}

function authorNode(author) {
  if (author.me) {
    var strong = document.createElement('strong');
    strong.textContent = author.name;
    return strong;
  }
  if (author.url) return link(author.url, author.name);
  return document.createTextNode(author.name);
}

// "A, B, C" with each name linked (or bolded, if it's me).
function authorList(authors) {
  var frag = document.createDocumentFragment();
  authors.forEach(function (author, i) {
    if (i > 0) frag.appendChild(document.createTextNode(', '));
    frag.appendChild(authorNode(author));
  });
  return frag;
}

// "<em>Venue</em>, Year" -- either half may be omitted.
function venueNode(paper) {
  var frag = document.createDocumentFragment();
  if (paper.venue) {
    var em = document.createElement('em');
    em.textContent = paper.venue;
    frag.appendChild(em);
  }
  if (paper.year) {
    frag.appendChild(document.createTextNode(paper.venue ? ', ' + paper.year : String(paper.year)));
  }
  return frag;
}

// "arXiv / code / project"
function linkList(links) {
  var frag = document.createDocumentFragment();
  links.forEach(function (item, i) {
    if (i > 0) frag.appendChild(document.createTextNode(' / '));
    frag.appendChild(link(item.url, item.label));
  });
  return frag;
}

function thumbnailCell(paper) {
  var td = document.createElement('td');
  td.style.cssText = 'padding:16px;width:25%;vertical-align:middle';
  if (paper.image) {
    var div = document.createElement('div');
    div.className = 'one';
    var img = document.createElement('img');
    img.src = paper.image;
    img.setAttribute('width', '100%');
    img.alt = paper.title;
    div.appendChild(img);
    td.appendChild(div);
  }
  return td;
}

function detailsCell(paper) {
  var td = document.createElement('td');
  td.style.cssText = 'padding:8px;width:75%;vertical-align:middle';

  td.appendChild(titleNode(paper));
  td.appendChild(document.createElement('br'));

  if (paper.authors && paper.authors.length) {
    td.appendChild(authorList(paper.authors));
    td.appendChild(document.createElement('br'));
  }

  if (paper.venue || paper.year) {
    td.appendChild(venueNode(paper));
    td.appendChild(document.createElement('br'));
  }

  if (paper.links && paper.links.length) {
    td.appendChild(document.createElement('p'));
    td.appendChild(linkList(paper.links));
  }

  if (paper.description) {
    td.appendChild(document.createElement('p'));
    var p = document.createElement('p');
    p.textContent = paper.description;
    td.appendChild(p);
  }

  return td;
}

function paperRow(paper) {
  var tr = document.createElement('tr');
  tr.appendChild(thumbnailCell(paper));
  tr.appendChild(detailsCell(paper));
  return tr;
}

// One-liner row: "Title <en dash> paper". The title is plain text; only the
// trailing "paper" is a link, pointing at the PDF in `paper`.
function mathRow(entry) {
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.style.cssText = 'padding:8px 16px;width:100%;vertical-align:middle';

  td.appendChild(document.createTextNode(entry.title));
  if (entry.paper) {
    td.appendChild(document.createTextNode(' – '));
    td.appendChild(link(entry.paper, 'paper'));
  }

  tr.appendChild(td);
  return tr;
}

// Fill <tbody id="..."> with one row per visible entry in the JSON file.
function mount(tbodyId, dataUrl, rowBuilder) {
  var tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  fetch(dataUrl)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (items) {
      tbody.textContent = '';
      items
        .filter(function (item) { return !item.hidden; })
        .forEach(function (item) { tbody.appendChild(rowBuilder(item)); });
    })
    .catch(function (err) {
      // Most likely cause: opening index.html over file:// , where fetch is
      // blocked. Serve the folder instead: python3 -m http.server
      console.error('Could not load ' + dataUrl + ':', err);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  mount('publications', 'assets/data/publications.json', paperRow);
  mount('math', 'assets/data/math.json', mathRow);
});

const htmlElements = {
    h1: {
        name: 'Heading 1 (H1)',
        code: '<h1>Ini adalah Heading 1</h1>',
        result: '<h1 style="color: #667eea; margin: 0;">Ini adalah Heading 1</h1>'
    },
    p: {
        name: 'Paragraf',
        code: '<p>Ini adalah paragraf. Paragraf digunakan untuk menampilkan teks biasa di halaman web.</p>',
        result: '<p style="margin: 0; color: #333;">Ini adalah paragraf. Paragraf digunakan untuk menampilkan teks biasa di halaman web.</p>'
    },
    a: {
        name: 'Link / Hyperlink',
        code: '<a href="https://example.com">Ini adalah sebuah link</a>',
        result: '<a href="#" style="color: #667eea; text-decoration: underline; cursor: pointer;">Ini adalah sebuah link</a>'
    },
    img: {
        name: 'Gambar (Image)',
        code: '<img src="image.jpg" alt="Deskripsi gambar">',
        result: '<div style="background: #f0f4ff; padding: 40px; text-align: center; border-radius: 8px;"><span style="font-size: 48px;">🖼️</span><p style="margin-top: 10px; color: #667eea;">Placeholder untuk Gambar</p></div>'
    },
    button: {
        name: 'Tombol (Button)',
        code: '<button>Klik Saya!</button>',
        result: '<button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Klik Saya!</button>'
    },
    input: {
        name: 'Input Field',
        code: '<input type="text" placeholder="Masukkan nama Anda">',
        result: '<input type="text" placeholder="Masukkan nama Anda" style="padding: 10px; border: 2px solid #667eea; border-radius: 5px; font-size: 14px; width: 300px;">'
    },
    div: {
        name: 'Division (Div)',
        code: '<div style="background: #f0f4ff; padding: 20px; border-radius: 8px;">\n  <p>Ini adalah konten di dalam div</p>\n</div>',
        result: '<div style="background: #f0f4ff; padding: 20px; border-radius: 8px;"><p style="margin: 0; color: #333;">Ini adalah konten di dalam div</p></div>'
    },
    span: {
        name: 'Span',
        code: '<p>Ini adalah <span style="color: #667eea; font-weight: bold;">teks khusus</span> dalam paragraf</p>',
        result: '<p style="margin: 0; color: #333;">Ini adalah <span style="color: #667eea; font-weight: bold;">teks khusus</span> dalam paragraf</p>'
    },
    ul: {
        name: 'Unordered List',
        code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>',
        result: '<ul style="margin: 0; color: #333;"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>'
    },
    ol: {
        name: 'Ordered List',
        code: '<ol>\n  <li>Langkah pertama</li>\n  <li>Langkah kedua</li>\n  <li>Langkah ketiga</li>\n</ol>',
        result: '<ol style="margin: 0; color: #333;"><li>Langkah pertama</li><li>Langkah kedua</li><li>Langkah ketiga</li></ol>'
    },
    strong: {
        name: 'Strong (Teks Penting)',
        code: '<p>Ini adalah <strong>teks penting</strong> dalam paragraf</p>',
        result: '<p style="margin: 0; color: #333;">Ini adalah <strong style="font-weight: bold;">teks penting</strong> dalam paragraf</p>'
    },
    em: {
        name: 'Em (Teks Penekanan)',
        code: '<p>Ini adalah <em>teks dengan penekanan</em> dalam paragraf</p>',
        result: '<p style="margin: 0; color: #333;">Ini adalah <em style="font-style: italic;">teks dengan penekanan</em> dalam paragraf</p>'
    },
    br: {
        name: 'Line Break',
        code: '<p>Baris pertama<br>Baris kedua</p>',
        result: '<p style="margin: 0; color: #333;">Baris pertama<br>Baris kedua</p>'
    },
    hr: {
        name: 'Horizontal Rule',
        code: '<hr>',
        result: '<hr style="border: none; border-top: 2px solid #667eea; margin: 20px 0;">'
    },
    form: {
        name: 'Form',
        code: '<form>\n  <input type="text" placeholder="Nama">\n  <button type="submit">Submit</button>\n</form>',
        result: '<form style="padding: 15px; background: #f0f4ff; border-radius: 8px;"><input type="text" placeholder="Nama" style="padding: 8px; border: 1px solid #667eea; border-radius: 4px; margin-right: 10px;"><button type="submit" style="background: #667eea; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Submit</button></form>'
    },
    label: {
        name: 'Label',
        code: '<label for="username">Username:</label>\n<input id="username" type="text">',
        result: '<div><label for="username" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Username:</label><input id="username" type="text" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 250px;"></div>'
    },
    textarea: {
        name: 'Text Area',
        code: '<textarea placeholder="Tulis pesan Anda di sini..."></textarea>',
        result: '<textarea placeholder="Tulis pesan Anda di sini..." style="padding: 10px; border: 2px solid #667eea; border-radius: 5px; width: 300px; height: 100px; font-family: Arial;"></textarea>'
    },
    select: {
        name: 'Select Dropdown',
        code: '<select>\n  <option>Pilih Opsi</option>\n  <option>Opsi 1</option>\n  <option>Opsi 2</option>\n</select>',
        result: '<select style="padding: 8px; border: 2px solid #667eea; border-radius: 5px; font-size: 14px;"><option>Pilih Opsi</option><option>Opsi 1</option><option>Opsi 2</option></select>'
    },
    header: {
        name: 'Header',
        code: '<header>\n  <h1>Logo</h1>\n  <nav><a href="#">Home</a> | <a href="#">About</a></nav>\n</header>',
        result: '<header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px;"><h1 style="margin: 0 0 10px 0; font-size: 24px;">Logo</h1><nav><a href="#" style="color: white; text-decoration: none; margin-right: 15px;">Home</a> | <a href="#" style="color: white; text-decoration: none; margin-left: 15px;">About</a></nav></header>'
    },
    nav: {
        name: 'Navigation',
        code: '<nav>\n  <a href="#">Home</a>\n  <a href="#">About</a>\n  <a href="#">Contact</a>\n</nav>',
        result: '<nav style="background: #f0f4ff; padding: 15px; border-radius: 8px;"><a href="#" style="color: #667eea; text-decoration: none; margin-right: 20px; font-weight: bold;">Home</a><a href="#" style="color: #667eea; text-decoration: none; margin-right: 20px; font-weight: bold;">About</a><a href="#" style="color: #667eea; text-decoration: none; font-weight: bold;">Contact</a></nav>'
    },
    main: {
        name: 'Main Content',
        code: '<main>\n  <h2>Konten Utama</h2>\n  <p>Ini adalah konten utama halaman.</p>\n</main>',
        result: '<main style="background: white; padding: 20px; border: 2px solid #667eea; border-radius: 8px;"><h2 style="color: #667eea; margin: 0 0 10px 0;">Konten Utama</h2><p style="margin: 0; color: #333;">Ini adalah konten utama halaman.</p></main>'
    },
    footer: {
        name: 'Footer',
        code: '<footer>\n  <p>&copy; 2024 Website Saya. Semua hak dilindungi.</p>\n</footer>',
        result: '<footer style="background: #f0f4ff; padding: 20px; text-align: center; border-radius: 8px;"><p style="margin: 0; color: #667eea; font-size: 14px;">&copy; 2024 Website Saya. Semua hak dilindungi.</p></footer>'
    },
    article: {
        name: 'Article',
        code: '<article>\n  <h2>Judul Artikel</h2>\n  <p>Konten artikel di sini...</p>\n</article>',
        result: '<article style="background: white; padding: 20px; border-left: 4px solid #667eea; border-radius: 8px;"><h2 style="color: #667eea; margin: 0 0 10px 0;">Judul Artikel</h2><p style="margin: 0; color: #333;">Konten artikel di sini...</p></article>'
    },
    section: {
        name: 'Section',
        code: '<section>\n  <h2>Bagian 1</h2>\n  <p>Konten bagian pertama...</p>\n</section>',
        result: '<section style="background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;"><h2 style="color: #667eea; margin: 0 0 10px 0; font-size: 20px;">Bagian 1</h2><p style="margin: 0; color: #333;">Konten bagian pertama...</p></section>'
    },
    aside: {
        name: 'Aside (Sidebar)',
        code: '<aside>\n  <h3>Widget Samping</h3>\n  <p>Konten sidebar...</p>\n</aside>',
        result: '<aside style="background: #f0f4ff; padding: 15px; border-radius: 8px; border-left: 3px solid #667eea;"><h3 style="color: #667eea; margin: 0 0 10px 0;">Widget Samping</h3><p style="margin: 0; color: #333; font-size: 14px;">Konten sidebar...</p></aside>'
    },
    table: {
        name: 'Tabel',
        code: '<table border="1">\n  <tr><td>Sel 1</td><td>Sel 2</td></tr>\n  <tr><td>Sel 3</td><td>Sel 4</td></tr>\n</table>',
        result: '<table style="border-collapse: collapse; margin: 0;"><tr><td style="border: 1px solid #667eea; padding: 8px;">Sel 1</td><td style="border: 1px solid #667eea; padding: 8px;">Sel 2</td></tr><tr><td style="border: 1px solid #667eea; padding: 8px;">Sel 3</td><td style="border: 1px solid #667eea; padding: 8px;">Sel 4</td></tr></table>'
    },
    th: {
        name: 'Table Header',
        code: '<table><tr>\n  <th>Header 1</th>\n  <th>Header 2</th>\n</tr></table>',
        result: '<table style="border-collapse: collapse;"><tr><th style="background: #667eea; color: white; padding: 10px; text-align: left; border: 1px solid #667eea;">Header 1</th><th style="background: #667eea; color: white; padding: 10px; text-align: left; border: 1px solid #667eea;">Header 2</th></tr></table>'
    },
    td: {
        name: 'Table Data',
        code: '<table><tr>\n  <td>Data 1</td>\n  <td>Data 2</td>\n</tr></table>',
        result: '<table style="border-collapse: collapse;"><tr><td style="border: 1px solid #ddd; padding: 10px;">Data 1</td><td style="border: 1px solid #ddd; padding: 10px;">Data 2</td></tr></table>'
    },
    video: {
        name: 'Video Player',
        code: '<video width="320" height="240" controls>\n  <source src="movie.mp4" type="video/mp4">\n</video>',
        result: '<div style="background: #000; width: 320px; height: 240px; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="color: white; text-align: center;">▶️ Video Player<br><small>320 × 240</small></span></div>'
    },
    audio: {
        name: 'Audio Player',
        code: '<audio controls>\n  <source src="audio.mp3" type="audio/mpeg">\n</audio>',
        result: '<div style="background: #f0f4ff; padding: 10px; border-radius: 8px; width: 300px;"><span style="color: #667eea;">🎵 Audio Player</span><br><small style="color: #999;">Format: MP3, WAV, OGG</small></div>'
    },
    iframe: {
        name: 'IFrame',
        code: '<iframe src="https://example.com" width="400" height="300"></iframe>',
        result: '<div style="border: 2px solid #667eea; width: 400px; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f0f4ff;"><span style="text-align: center; color: #667eea;">📱 IFrame<br><small>400 × 200</small></span></div>'
    },
    details: {
        name: 'Details (Accordion)',
        code: '<details>\n  <summary>Klik untuk membuka</summary>\n  <p>Konten yang tersembunyi</p>\n</details>',
        result: '<details style="background: #f0f4ff; padding: 10px; border-radius: 8px; cursor: pointer;"><summary style="font-weight: bold; color: #667eea;">▶ Klik untuk membuka</summary><p style="margin-top: 10px; color: #333;">Konten yang tersembunyi</p></details>'
    },
    progress: {
        name: 'Progress Bar',
        code: '<progress value="70" max="100"></progress>',
        result: '<progress value="70" max="100" style="width: 300px; height: 20px;"></progress>'
    },
    mark: {
        name: 'Mark (Highlight)',
        code: '<p>Ini adalah <mark style="background-color: yellow;">teks yang disorot</mark></p>',
        result: '<p style="margin: 0; color: #333;">Ini adalah <mark style="background-color: yellow; padding: 2px 4px;">teks yang disorot</mark></p>'
    }
};

const cssProperties = {
    'color': {
        name: 'Color (Warna Teks)',
        code: '<p style="color: #667eea;">Ini adalah teks berwarna biru</p>',
        result: '<p style="color: #667eea; margin: 0;">Ini adalah teks berwarna biru</p>'
    },
    'background-color': {
        name: 'Background Color',
        code: '<div style="background-color: #f0f4ff; padding: 20px;">\n  Elemen dengan latar belakang biru muda\n</div>',
        result: '<div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px; color: #333;">Elemen dengan latar belakang biru muda</div>'
    },
    'font-size': {
        name: 'Font Size',
        code: '<p style="font-size: 24px;">Teks berukuran 24px</p>',
        result: '<p style="font-size: 24px; margin: 0; color: #333;">Teks berukuran 24px</p>'
    },
    'font-weight': {
        name: 'Font Weight',
        code: '<p style="font-weight: bold;">Teks tebal (bold)</p>',
        result: '<p style="font-weight: bold; margin: 0; color: #333;">Teks tebal (bold)</p>'
    },
    'text-align': {
        name: 'Text Align',
        code: '<p style="text-align: center;">Teks di tengah</p>',
        result: '<p style="text-align: center; margin: 0; color: #333; background: #f0f4ff; padding: 15px; border-radius: 8px;">Teks di tengah</p>'
    },
    'text-decoration': {
        name: 'Text Decoration',
        code: '<p style="text-decoration: underline;">Teks dengan garis bawah</p>',
        result: '<p style="text-decoration: underline; margin: 0; color: #333;">Teks dengan garis bawah</p>'
    },
    'margin': {
        name: 'Margin (Jarak Luar)',
        code: '<div style="border: 2px solid #667eea; margin: 20px;">\n  Elemen dengan margin 20px\n</div>',
        result: '<div style="border: 2px solid #667eea; margin: 20px; padding: 15px; border-radius: 8px; color: #333;">Elemen dengan margin 20px</div>'
    },
    'padding': {
        name: 'Padding (Jarak Dalam)',
        code: '<div style="background: #667eea; color: white; padding: 30px;">\n  Elemen dengan padding 30px\n</div>',
        result: '<div style="background: #667eea; color: white; padding: 30px; border-radius: 8px; text-align: center;">Elemen dengan padding 30px</div>'
    },
    'border': {
        name: 'Border (Garis Tepi)',
        code: '<div style="border: 3px solid #667eea; padding: 15px;">\n  Elemen dengan border 3px\n</div>',
        result: '<div style="border: 3px solid #667eea; padding: 15px; border-radius: 8px; color: #333;">Elemen dengan border 3px</div>'
    },
    'width': {
        name: 'Width (Lebar)',
        code: '<div style="width: 200px; background: #667eea; color: white; padding: 10px;">\n  Lebar 200px\n</div>',
        result: '<div style="width: 200px; background: #667eea; color: white; padding: 10px; border-radius: 8px; text-align: center;">Lebar 200px</div>'
    },
    'height': {
        name: 'Height (Tinggi)',
        code: '<div style="height: 100px; background: #667eea; color: white; display: flex; align-items: center; justify-content: center;">\n  Tinggi 100px\n</div>',
        result: '<div style="height: 100px; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px;">Tinggi 100px</div>'
    },
    'display': {
        name: 'Display (Flex)',
        code: '<div style="display: flex; gap: 10px;">\n  <div>Box 1</div>\n  <div>Box 2</div>\n  <div>Box 3</div>\n</div>',
        result: '<div style="display: flex; gap: 10px;"><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Box 1</div><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Box 2</div><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Box 3</div></div>'
    },
    'position': {
        name: 'Position (Relative)',
        code: '<div style="position: relative; left: 20px; top: 10px; background: #667eea; color: white; padding: 15px; width: fit-content;">\n  Posisi berubah\n</div>',
        result: '<div style="position: relative; left: 20px; top: 10px; background: #667eea; color: white; padding: 15px; border-radius: 8px; width: fit-content;">Posisi berubah</div>'
    },
    'flex-direction': {
        name: 'Flex Direction (Column)',
        code: '<div style="display: flex; flex-direction: column; gap: 10px;">\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</div>',
        result: '<div style="display: flex; flex-direction: column; gap: 10px;"><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 1</div><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 2</div><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 3</div></div>'
    },
    'justify-content': {
        name: 'Justify Content (Center)',
        code: '<div style="display: flex; justify-content: center; gap: 10px; background: #f0f4ff; padding: 20px;">\n  <div>Item 1</div>\n  <div>Item 2</div>\n</div>',
        result: '<div style="display: flex; justify-content: center; gap: 10px; background: #f0f4ff; padding: 20px; border-radius: 8px;"><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 1</div><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 2</div></div>'
    },
    'align-items': {
        name: 'Align Items (Center)',
        code: '<div style="display: flex; align-items: center; height: 100px; background: #f0f4ff; padding: 10px;">\n  <p>Teks rata tengah vertikal</p>\n</div>',
        result: '<div style="display: flex; align-items: center; height: 100px; background: #f0f4ff; padding: 10px; border-radius: 8px;"><p style="margin: 0; color: #667eea; font-weight: bold;">Teks rata tengah vertikal</p></div>'
    },
    'gap': {
        name: 'Gap (Jarak Antar Item)',
        code: '<div style="display: flex; gap: 20px;">\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</div>',
        result: '<div style="display: flex; gap: 20px;"><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 1</div><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 2</div><div style="background: #667eea; color: white; padding: 10px; border-radius: 5px;">Item 3</div></div>'
    },
    'border-radius': {
        name: 'Border Radius (Sudut Membulat)',
        code: '<div style="background: #667eea; color: white; padding: 20px; border-radius: 15px;">\n  Sudut Membulat\n</div>',
        result: '<div style="background: #667eea; color: white; padding: 20px; border-radius: 15px; text-align: center;">Sudut Membulat</div>'
    },
    'box-shadow': {
        name: 'Box Shadow (Bayangan)',
        code: '<div style="background: white; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">\n  Elemen dengan bayangan\n</div>',
        result: '<div style="background: white; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-radius: 8px; color: #333;">Elemen dengan bayangan</div>'
    },
    'opacity': {
        name: 'Opacity (Transparansi)',
        code: '<div style="background: #667eea; color: white; padding: 20px; opacity: 0.6;">\n  Elemen semi-transparan\n</div>',
        result: '<div style="background: #667eea; color: white; padding: 20px; opacity: 0.6; border-radius: 8px; text-align: center;">Elemen semi-transparan</div>'
    },
    'cursor': {
        name: 'Cursor (Bentuk Kursor)',
        code: '<button style="cursor: pointer;">Hover untuk lihat pointer</button>',
        result: '<button style="cursor: pointer; background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-weight: bold;">Hover untuk lihat pointer</button>'
    },
    'filter': {
        name: 'Filter (Blur)',
        code: '<img src="image.jpg" style="filter: blur(5px);" alt="Gambar blur">',
        result: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 200px; height: 150px; border-radius: 8px; filter: blur(2px); display: flex; align-items: center; justify-content: center; color: white;">Blur Filter</div>'
    },
    'transform': {
        name: 'Transform (Scale)',
        code: '<div style="transform: scale(1.2); background: #667eea; color: white; padding: 15px; width: fit-content;">\n  Elemen diperbesar\n</div>',
        result: '<div style="transform: scale(1.2); background: #667eea; color: white; padding: 15px; border-radius: 8px; width: fit-content;">Elemen diperbesar</div>'
    },
    'transition': {
        name: 'Transition (Animasi Halus)',
        code: '<div id="box" style="background: #667eea; width: 100px; height: 100px; transition: all 0.3s ease;"></div>\n<button onclick="document.getElementById(\'box\').style.width=\'200px\'">Klik</button>',
        result: '<div style="background: #667eea; width: 100px; height: 100px; border-radius: 8px; margin-bottom: 10px;"></div><button style="background: #667eea; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Klik untuk animasi</button>'
    },
    'text-shadow': {
        name: 'Text Shadow (Bayangan Teks)',
        code: '<p style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3); font-size: 24px; font-weight: bold;">\n  Teks dengan bayangan\n</p>',
        result: '<p style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3); font-size: 24px; font-weight: bold; color: #667eea; margin: 0;">Teks dengan bayangan</p>'
    },
    'background-image': {
        name: 'Background Image',
        code: '<div style="background-image: url(\'bg.jpg\'); background-size: cover; width: 300px; height: 150px;">\n</div>',
        result: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 300px; height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">Background Image</div>'
    },
    'overflow': {
        name: 'Overflow (Hidden)',
        code: '<div style="width: 200px; height: 100px; overflow: hidden; background: #f0f4ff;">\n  Teks yang melebihi akan tersembunyi\n</div>',
        result: '<div style="width: 200px; height: 100px; overflow: hidden; background: #f0f4ff; border: 2px solid #667eea; border-radius: 8px; padding: 10px; color: #333;">Teks yang melebihi akan tersembunyi</div>'
    },
    'z-index': {
        name: 'Z-Index (Lapisan)',
        code: '<div style="position: relative; width: 200px;">\n  <div style="background: #667eea; color: white; padding: 15px; position: absolute; z-index: 2; left: 50px;">Box 2</div>\n  <div style="background: #764ba2; color: white; padding: 15px; position: relative;">Box 1</div>\n</div>',
        result: '<div style="position: relative; width: 200px; height: 80px;"><div style="background: #667eea; color: white; padding: 15px; position: absolute; z-index: 2; left: 30px; border-radius: 8px;">Z-Index: 2</div><div style="background: #764ba2; color: white; padding: 15px; position: relative; border-radius: 8px;">Z-Index: 1</div></div>'
    }
};

function showPreview(item, type) {
    const modal = document.getElementById('previewModal');
    const previewResult = document.getElementById('previewResult');
    const previewCode = document.getElementById('previewCode');
    const previewTitle = document.getElementById('previewTitle');

    let data;
    if (type === 'HTML') {
        data = htmlElements[item];
    } else {
        data = cssProperties[item];
    }

    if (!data) return;

    previewTitle.textContent = `Preview: ${data.name}`;
    previewResult.innerHTML = data.result;
    previewCode.textContent = data.code;
    modal.style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Close modal dengan tombol Esc
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePreview();
    }
});
content = open('client/src/pages/FileComplaint.jsx', 'r', encoding='utf-8').read()

# 1. Add evidenceImages to form state
content = content.replace(
    "offenderName: \"\", offenderPlatform: \"\", incidentDescription: \"\", harmfulContent: \"\",",
    "offenderName: \"\", offenderPlatform: \"\", incidentDescription: \"\", harmfulContent: \"\", evidenceImages: [],"
)

# 2. Add images to the submit payload (both routes)
content = content.replace(
    "await axios.post(\"/api/complaints\", {\n          ...form,\n          reporterName: user.name,\n          reporterEmail: user.email,\n        });",
    """await axios.post("/api/complaints", {
          ...form,
          reporterName: user.name,
          reporterEmail: user.email,
          evidenceImages: form.evidenceImages,
        });"""
)
content = content.replace(
    "await axios.post(\"/api/complaints/guest\", { ...form });",
    "await axios.post(\"/api/complaints/guest\", { ...form, evidenceImages: form.evidenceImages });"
)

# 3. Add image upload UI in step 3, after the harmful content textarea section
old_section = '''              <p className="text-slate-600 text-xs mt-1 text-right">{form.harmfulContent.length} characters</p>
              </div>'''

new_section = '''              <p className="text-slate-600 text-xs mt-1 text-right">{form.harmfulContent.length} characters</p>
              </div>

              {/* Image evidence upload */}
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                  Upload Screenshot Evidence
                  <span className="text-slate-600 ml-1">(optional, max 3 images)</span>
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-4 hover:border-brand-500/30 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="evidence-upload"
                    className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files).slice(0, 3);
                      const readers = files.map(file => new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve({ name: file.name, data: reader.result });
                        reader.readAsDataURL(file);
                      }));
                      Promise.all(readers).then(images => setForm({ ...form, evidenceImages: images }));
                    }}
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <span className="text-3xl">📎</span>
                    <span className="text-slate-400 text-sm">Click to upload screenshots</span>
                    <span className="text-slate-600 text-xs">PNG, JPG, WEBP up to 5MB each</span>
                  </label>
                  {form.evidenceImages.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.evidenceImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img.data} alt={img.name} className="w-20 h-20 object-cover rounded-lg border border-white/10" />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, evidenceImages: form.evidenceImages.filter((_, j) => j !== i) })}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            ×
                          </button>
                          <p className="text-slate-600 text-xs mt-1 truncate w-20">{img.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>'''

content = content.replace(old_section, new_section)

open('client/src/pages/FileComplaint.jsx', 'w', encoding='utf-8', newline='\n').write(content)
print('FileComplaint.jsx updated with image upload')

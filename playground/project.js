export class Project {
  constructor (settings) {
    this.id = settings.id || Math.random();
    this.codeFiles = settings.codeFiles || {
      'main' : ''
    };
    this.thumbnail = settings.thumbnail || '';
    this.title = settings.title || 'My Proj';
  }

  toJSON () {
    return JSON.stringify({
      id: this.id,
      codeFiles: this.codeFiles,
      thumbnail: this.thumbnail,
      title: this.title,
    });
  }
}
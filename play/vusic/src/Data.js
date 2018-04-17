export class Song {
  // name, artist, length, published, infos, id
  constructor (config) {
    this.name = config.name
    this.artist = config.artist
    this.length = config.length
    this.published = config.published
    this.infos = config.infos
    this.id = config.id
  }
}

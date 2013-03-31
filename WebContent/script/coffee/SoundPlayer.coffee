# A singleton class that manages interaction with SoundCloud APIs
define(
  ['SoundCloudAPI', 'Backbone'],
  (SC, Backbone)->
    instance = null

    SoundPlayer = ->
      if instance
        throw new Error "Only one instance can be instantiated."
      @initialize()

    # Constructor
    SoundPlayer::initialize = ->
      # initialize client with app credentials
      SC.initialize
        client_id: '8ef8b80025535d68a51f4ee5c3343fc0',
        redirect_uri: 'http://kotaroshima.github.com/playlist/WebContent/callback.html'
      @domNode = document.getElementById 'embedContainer'
      @

    SoundPlayer.getInstance = ->
      if !instance
        instance = new SoundPlayer()
      instance

    # Initialization
    SoundPlayer::setup = (callback)->
      # by default, show tracks ordered by 'hotness'
      SC.get '/tracks',
        { order: 'hotness', limit: 10, filter: 'streamable' },
        callback
      return

    # Plays sound
    SoundPlayer::play = (model)->
      Backbone.trigger "SONG_START", model
      url = model.get "uri"
      if !@_playerInit
        # embed player widget
        SC.oEmbed url, {auto_play: true}, (response)=>
          @domNode.innerHTML = response.html

          # connect to 'SC.Widget.Events.FINISH' to notify to play next song
          widget = @_widget = SC.Widget $('#embedContainer IFRAME').get(0)
          widget.bind SC.Widget.Events.FINISH, ->
            Backbone.trigger "SONG_FINISHED"
            return
          @_playerInit = true
          widget.play() # call play explicitly, because somehow 'auto_play' didn't work in iPhone
          return
      else
        # already embedded to updates url and plays
        @_widget.load url, {auto_play: true}
        @_widget.play() # call play explicitly, because somehow 'auto_play' didn't work in iPhone
      return

    # Searches for songs with a keyword
    SoundPlayer::search = (searchString, callback)->
      SC.get '/tracks', { q: searchString }, callback
      return

    SoundPlayer.getInstance()
)
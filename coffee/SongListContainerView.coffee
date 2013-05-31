define(
  ['Backpack', 'SongItemView', 'SoundPlayer', 'text!template/SongListContainerView.html'],
  (Backpack, SongItemView, SoundPlayer, viewTemplate)->
    Backpack.View.extend
      template: _.template viewTemplate
      events:
        'click #showPlayListButton': 'onPlayListButtonClicked'
        'click .now-playing-button': 'onNowPlayingButtonClicked'
        'click #searchBtn': 'onSearchButtonClicked'

      initialize:(options)->
        Backpack.View::initialize.apply @, arguments
        @render()

        collection = @collection = new Backpack.Collection null,
          model: Backpack.Model

        songListView = new Backpack.ListView
          collection: collection
          itemView: SongItemView
          subscribers:
            SONGLIST_LOADING: 'setLoading'
        @$('#songListView').append songListView.$el

        SoundPlayer.getInstance().setup $('#embedContainer'), (tracks)->
          collection.reset tracks
          return
        return

      render:->
        @$el.html @template()
        @

      onPlayListButtonClicked:->

      onNowPlayingButtonClicked:->

      onSearchButtonClicked:->
        SoundPlayer.getInstance().loadTracks { q: $('#searchBox').val() }, (tracks)=>
          @collection.reset tracks
          return
        return
)
# A view which contains:
# - play list view
# - back to song list button
# It is implemented as a dialog
define(
  ['jQuery', 'Underscore', 'Backbone', 'ListModel', 'PlayListCollection', 'backpack/components/ListView', 'PlayItemView', 'backpack/plugins/Sortable', 'text!template/PlayListContainerView.html'],
  ($, _, Backbone, ListModel, PlayListCollection, ListView, PlayItemView, Sortable, viewTemplate)->
    Backbone.View.extend
      el: "#playListContainerView"
      template: _.template viewTemplate

      events:
        "click .songListBtn": "close"

      initialize:->
        @render()

        collection = new PlayListCollection null,
          model: ListModel
          subscribers:
            SONG_FINISHED: 'onSongFinished'
        view = @listView = new ListView
          collection: collection
          el: '#playListView'
          itemClass: PlayItemView
          plugins: [Sortable]
          subscribers:
            PLAYLIST_INDEX_UPDATED: @onCurrentIndexUpdated
          onCurrentIndexUpdated:(index)->
            if @_nowPlayingView
              @_nowPlayingView.$el.removeClass 'now-playing'
            if index isnt -1
              view = @_nowPlayingView = @getChild index
              view.$el.addClass 'now-playing'
            return
        view.render()
        Backbone.on "SHOW_PLAYLIST", @open, @
        return

      render:->
        @$el.html @template()

        @$el.dialog(
          autoOpen: false
          width: $(window).width()
          height: $(window).height()
        )
        @

      open:->
        @$el.dialog 'open'
        return

      close:->
        @$el.dialog 'close'
        return

      destroy:->
        Backbone.off "SHOW_PLAYLIST", @open, @
        Backbone.View::destroy.call @
        return
)
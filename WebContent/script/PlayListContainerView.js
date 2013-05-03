// Generated by CoffeeScript 1.6.2
(function() {
  define(['jQueryUITouchPunch', 'Backpack', 'CurrentModel', 'PlayItemView', 'text!template/PlayListContainerView.html'], function($, Backpack, CurrentModel, PlayItemView, viewTemplate) {
    return Backpack.View.extend({
      template: _.template(viewTemplate),
      events: {
        'click .songListBtn': 'onSongListButtonClicked'
      },
      initialize: function(options) {
        var collection, view;

        Backpack.View.prototype.initialize.apply(this, arguments);
        this.render();
        collection = new Backpack.Collection(null, {
          model: Backpack.Model,
          plugins: [CurrentModel],
          subscribers: {
            SONG_STARTED: 'setCurrentModel',
            SONG_FINISHED: 'onSongFinished',
            PLAYLIST_ITEM_ADD: 'add',
            PLAYLIST_ITEM_INSERT: 'insertAfterCurrent'
          },
          publishers: {
            setCurrentIndex: 'PLAYLIST_INDEX_UPDATED'
          },
          onSongFinished: function() {
            var model;

            model = this.next();
            if (model) {
              Backbone.trigger('PLAYER_PLAY', model);
            }
          }
        });
        view = this.listView = new Backpack.ListView({
          collection: collection,
          itemClass: PlayItemView,
          plugins: [Backpack.Container, Backpack.Sortable],
          subscribers: {
            PLAYLIST_INDEX_UPDATED: 'onCurrentIndexUpdated'
          },
          onCurrentIndexUpdated: function(index) {
            if (this._nowPlayingView) {
              this._nowPlayingView.$el.removeClass('now-playing');
            }
            if (index !== -1) {
              this._nowPlayingView = this.getChild(index);
              this._nowPlayingView.$el.addClass('now-playing');
            }
          }
        });
        view.render();
        this.$('#playListView').append(view.$el);
      },
      render: function() {
        this.$el.html(this.template());
        return this;
      },
      onSongListButtonClicked: function() {}
    });
  });

}).call(this);

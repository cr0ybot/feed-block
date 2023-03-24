# Feed Loop Block

Advanced RSS and Atom feed block with configurable child blocks for the WordPress Gutenberg editor, similar to the Query Loop block.

## Blocks

### Feed Loop

The Feed Loop block is the main block that is used to display items from a feed. It is similar to the Query Loop block, but instead of querying posts from the WordPress database, it queries items from an RSS or Atom feed.

### Feed Item Template

The Feed Item Template block is used to display the layout of a single feed item. It is similar to the Post Template block, but instead of displaying a post, it displays a feed item.

Inside the Feed Item Template block, you can add the blocks below to display parts of the feed item, such as the title, content, and summary. You can add any other block inside the Feed Item Template block as well, like groups and columns, to lay out the parts as you see fit.

### Feed Item Title

The Feed Item Title block is used to display the title of a feed item. It is similar to the Post Title block.

You can also choose to display the contents of a custom tag instead of the default title.

The title can optionally link to the feed item's URL, and includes other typography settings.

### Feed Item Content

The Feed Item Content block is used to display the content of a feed item. It is similar to the Post Content block.

You can also choose to display the contents of a custom tag instead of the default content.

The content can be displayed as HTML, HTML with images removed, and plain text, and also includes other typography settings.

### Feed Item Summary

The Feed Item Summary block is used to display the summary of a feed item. It is similar to the Post Excerpt block.

You can also choose to display the contents of a custom tag instead of the default content.

The summary can be limited to a certain number of words, and can optionally include a "read more" link.It also includes other typography settings.

### Feed Item Image

The Feed Item Image block is used to display the primary image of a feed item. It is similar to the Post Featured Image block.

The image can come from either an `itunes:image` tag (in the case of a podcast feed) or the first HTML `img` tag in the primary content, in that order. You can also choose a different tag that includes an HTML `img` tag, though tags with `src` or `href` attributes are not yet supported.

The image can optionally link to the feed item's URL, and includes other settings such as an optional overlay, aspect ratio, and border options.

### Feed Item Date

The Feed Item Date block is used to display the date of a feed item. It is similar to the Post Date block.

The date can be formatted using PHP date format strings, and includes other typography settings.

You can choose to display the published or modified date (if available), or the contents of a custom tag. When displaying a custom tag, additional input format options are available to read the date from the tag's contents.

### Feed Item Link

The Feed Item Link block is used to display a link to a feed item. It is similar to the Read More block.

The link can be styled with background and border options, and includes other typography settings.

It does not currently support displaying the contents of a custom tag, nor can it pull a URL from anywhere other than the feed item's main URL.

### Feed Loop - No Results

The Feed Loop - No Results block is used to display text or other blocks when no feed items are found. It is similar to the No Results block used by the Query Loop block.

## To Do

* [ ] Add support for displaying top-level feed attributes, such as title, description, icon, and authors.
* [ ] Add support for getting the image source from tag attributes.
* [ ] Add support for displaying enclosure media (audio/video).

# Feed Loop Block

Advanced RSS and Atom feed block with configurable child blocks for the WordPress Gutenberg editor, similar to the Query Loop block.

## Blocks

### Feed Loop

The Feed Loop block is the main block that is used to display items from a feed. It is similar to the Query Loop block, but instead of querying posts from the WordPress database, it queries items from an RSS or Atom feed.

### Feed Item Template

The Feed Item Template block is used to display the layout of a single feed item. It is similar to the Post Template block, but instead of displaying a post, it displays a feed item.

Inside the Feed Item Template block, you can add the blocks below to display parts of the feed item, such as the title, content, and summary. You can add any other block inside the Feed Item Template block as well, like groups and columns, to lay out the parts as you see fit.

### Feed Item Title

The Feed Item Title block is used to display the title of a feed item. It is similar to the Post Title block, but instead of displaying the title of a post, it displays the title of a feed item.

The title can optionally link to the feed item's URL, and includes other typography settings.

### Feed Item Content

The Feed Item Content block is used to display the content of a feed item. It is similar to the Post Content block, but instead of displaying the content of a post, it displays the content of a feed item.

The content can be displayed as HTML, HTML with images removed, and plain text, and also includes other typography settings.

### Feed Item Summary

The Feed Item Summary block is used to display the summary of a feed item. It is similar to the Post Excerpt block, but instead of displaying the excerpt of a post, it displays the summary of a feed item.

The summary can be limited to a certain number of words, and can optionally include a "read more" link.It also includes other typography settings.

### Feed Loop - No Results

The Feed Loop - No Results block is used to display text or other blocks when no feed items are found. It is similar to the No Results block used by the Query Loop block.

## To Do

* [ ] Prevent users without `unfiltered_html` capability from using HTML format in the Feed Item Content block, or otherwise filter the HTML.
* [ ] Add support for displaying top-level feed attributes, such as title, description, icon, and authors.
* [ ] Add support for choosing custom feed tags for any of the blocks within a Feed Item Template, instead of one all-encompasing Custom Feed Item.

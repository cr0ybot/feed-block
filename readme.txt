=== Feed Loop Block ===
Contributors:      cr0ybot
Tags:              block, rss, atom, feed
Tested up to:      6.1
Stable tag:        0.3.0
License:           GPL-3.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-3.0.html

Advanced RSS and Atom feed block with configurable child blocks, similar to the Query Loop block.


== Description ==

You've used other RSS feed plugins, or even the RSS Feed block available in WordPress. But you want more. You want to be able to customize the feed items as blocks like the Query Loop! You want to be able to place the image over here, and the description over there, and have the date show just here.

Look no further, because this is the plugin that solves that problem.

The Feed Loop Block can be placed in your post or page, and it will display the feed items as blocks just like the Query Loop. You can then customize the feed item blocks to display the information you want in the layout of your choosing.

= Feed Item Template Blocks =

The Feed Loop Block comes with a number of blocks that can be used to display the feed item information. These blocks can be placed in any order, and can be used multiple times.

* Feed Item Title
* Feed Item Summary
* Feed Item Content
* Feed Item Image
* Feed Item Date
* Feed Item Link

= Top-Level Feed Blocks =

These blocks can be placed outside of the Feed Item Template to display information about the feed itself.

* Feed No Results


== Frequently Asked Questions ==

= Why can't I use the HTML formatting option? =

Make sure your user account has the `unfiltered_html` capability, often reserved only for the admin role. This is a security feature to prevent users from accidentally adding malicious code to their posts.


== Changelog ==

= 2023-03-24 0.4.1 =
* Fix: Feed Item Title not rendering the correct heading level on front-end
* Fix: Use appropriate icon for Feed Item Link block

= 2023-03-23 0.4.0 =
* Breaking Change: Removed Custom Feed Item block in favor of pulling custom tag content into each available block
* Feature: Custom content in Feed Item Title block
* Feature: Custom content in Feed Item Summary block
* Feature: Custom content in Feed Item Content block
* Feature: Custom content in Feed Item Image block
* Feature: Feed Item Date block
* Feature: Feed Item Link block
* Feature: itunes:image tag checked for default image
* Fix: Feed items with links not inheriting Feed block context for rel/target values
* Fix: Better escaped output

= 2023-03-17 0.3.0 =
* Rename again to feed-block
* Feature: No Results block
* Fix: Fatal error when no feed items are found
* Optimization: Use object cache for processed feed

= 2023-03-02 0.2.0 =
* Rename to feed-loop-block (from rss-block)
* Feature: Custom Feed Item block for custom namespaced items
* Feature: Feed Item Image block with placeholder
* Feature: Feed Item Content block with no image option

= 2022-12-21 0.1.0 =
* Initial prerelease

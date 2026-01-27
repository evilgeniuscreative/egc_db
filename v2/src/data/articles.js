import React from "react";

const title =
	"An Open Letter to Mr. Tim Cook, Mr. Sundar Pichai, and Mr. Philip D. Moyer";
const image = "YouTubeOpenLetterChildSafety.jpg";
const imageAlt =
	"Why won't YouTube / Google block channels and keywords at childrens' expense? Hint: It's about money.";
function article_2() {
	return {
		date: "22 August 2025",
		title: title,
		description:
			"YouTube and Google have for decades been instransigent about creating effective child safety features, creating dangerous gaps that expose children to inappropriate content while maximizing advertising revenue through forced content exposure. They have repeatedly refused to allow blocking of channels and keywords in the adult accounts simply to force people to see what they don't want to and therefore make more advertising mone&#151;at the expense of chilren's pyschological safety. Greed over children.",
		url: "open-letter-to-youtube-google-and-vimeo",
		image: image,
		keywords: [
			"Google child safety",
			"YouTube.com child safety",
			"Vimeo child safety",
			"Google YouTube Irresponsible children",
			"YouTube.com Irresponsible children",
			"Vimeo Irresponsible children",
			"Google Irresponsible children",
			"YouTube greed",
			"YouTube fake child safety",
		],
		style: `
				.article-content {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.randImage {
					align-self: center;
					outline: 2px solid red;
				}
				`,
		body: (
			<React.Fragment>
				<div className="article-content">
					<div className="paragraph">
						<p className="article-subtitle">
							YouTube and Google have for decades been
							instransigent about creating effective child safety
							features, creating dangerous gaps that expose
							children to inappropriate content while maximizing
							advertising revenue through forced content exposure.
							They have repeatedly refused to allow blocking of
							channels and keywords in the adult accounts simply
							to force people to see what they don't want to and
							therefore make more advertising mone&#151;at the
							expense of chilren's pyschological safety. Greed
							over children."
						</p>
						<figure className="article-image-container">
							<img
								className="article-image"
								alt={imageAlt}
								src={`/images/${image}`}
							/>
							<figcaption>{imageAlt}</figcaption>
						</figure>
						<p>
							We write to you as concerned parents regarding the
							discriminatory implementation of child safety
							features across YouTube platforms, which creates
							dangerous gaps that expose children to inappropriate
							content while maximizing advertising revenue through
							forced content exposure.
						</p>
						<p>
							<strong>THE PROBLEM:</strong>
						</p>
						<p>
							Inconsistent Safety Implementation YouTube provides
							robust channel blocking on YouTube Kids but
							deliberately restricts these same protections on its
							main platform accessible to children. This creates a
							false sense of security for parents while ensuring
							continued exposure to inappropriate content.
						</p>
						<p>
							Ineffective "Don't Recommend" Feature The platform's
							only blocking option is intentionally inadequate.
							Children as young as 2-3 years old can independently
							access adult YouTube channels on family devices,
							where they encounter violent, inappropriate content
							that parents cannot effectively block despite the
							technical capability existing elsewhere in YouTube's
							ecosystem, i.e., on children's channels.
						</p>
						<p>
							YouTube's restriction of blocking functionality
							appears designed to force exposure to unwanted
							content (including channels containing violence,
							inappropriate language, and violent or sexual
							imagery, including thumbnails) to maximize
							algorithmic engagement and advertising revenue, even
							when children are the viewers, despite parents
							intending children to only use YouTube Kids,
							children often navigate to the main platform where
							protections disappear.
						</p>
						<p>
							Parents cannot protect children from inappropriate
							content despite YouTube's stated commitment to child
							safety. Technical capability to provide blocking
							(demonstrated on YouTube Kids) makes this
							restriction appear intentionally deceptive. Children
							may be exposed to sexual, violent, or religious
							content that is not appropriate for them, or against
							parental judgment. This raises COPPA concerns as
							children under 13 are accessing unfiltered content
							on Smart TV apps, mobile devices, Roku and other TV
							apps in addition to YouTube accessed via computer
							and phone apps and browsers where blocking gaps are
							most severe.
						</p>
						<p>
							<strong>
								We respectfully urge Apple. Google, Vimeo, and
								all other video platforms to implement
								consistent and effective blocking functionality,
								including keyword blocking, across all platforms
								accessible to children, not just designated
								children's apps, ensuring parents can adequately
								protect minors from inappropriate content
								exposure.
							</strong>
						</p>
						<p>
							Both of your companies have built reputations on
							family-friendly technology and protecting user
							privacy. We ask that you extend these values to
							ensure children receive consistent protection
							regardless of which device or platform they use to
							access content.
						</p>
						<p>
							We look forward to your leadership on this critical
							child safety issue.
						</p>
						<p>
							<strong>Respectfully, </strong>
						</p>
						<p>
							<strong>Ian Kleinfeld</strong>
							<br />
							and anyone who would like to forward, repost, post,
							email, or mail this.
						</p>
					</div>
				</div>
			</React.Fragment>
		),
	};
}
function article_1() {
	return {
		date: "11 Jan 2025",
		title: "NANO Command for MAC OS and Keyboards / NANO Keyboard shortcuts",
		description:
			"It's really difficult to find a map for nano format keyboards, which is really annoying so here you go!",
		style: `
		    body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            max-width: 1000px;
            margin: 40px auto;
            padding: 0 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #2c3e50;
            margin-top: 30px;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 5px;
        }
        .key-reference {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .key-column h3 {
            margin-top: 0;
            color: #34495e;
            font-size: 1.1em;
        }
        .key-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .key-list li {
            padding: 5px 0;
            font-family: 'Courier New', monospace;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th {
            background-color: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #ecf0f1;
        }
        tr:hover {
            background-color: #f8f9fa;
        }
        .keystroke {
            font-family: 'Courier New', monospace;
            background-color: #ecf0f1;
            padding: 3px 8px;
            border-radius: 3px;
            white-space: nowrap;
            font-weight: 600;
        }
        @media print {
            body {
                margin: 0;
                padding: 20px;
            }
            tr:hover {
                background-color: transparent;
            }
        }
		`,
		keywords: [
			"nano mac",
			"nano keyboard mac",
			"nano keyboard shortcuts mac",
			"Use nano on MAC",
			"Nano",
			"How to use nano on MAC",
			"",
		],
		body: (
			<React.Fragment>
				<h1>
					nano Editor Comamand Cheatsheet Keyboard Shortcuts for Mac
				</h1>

				<div className="key-reference">
					<div className="key-column">
						<h3>Key Symbols</h3>
						<ul className="key-list">
							<li>
								<strong>Ctrl</strong> or <strong>⌃</strong> =
								Control key
							</li>
							<li>
								<strong>Opt</strong> or <strong>⌥</strong> =
								Option key
							</li>
							<li>
								<strong>Cmd</strong> or <strong>⌘</strong> =
								Command key
							</li>
							<li>
								<strong>Tab</strong> = Tab key
							</li>
							<li>
								<strong>Del</strong> = Delete/Backspace
							</li>
							<li>
								<strong>fn</strong> = Function key
							</li>
						</ul>
					</div>
					<div className="key-column">
						<h3>Mac Keyboard Reminders</h3>
						<ul className="key-list">
							<li>
								<strong>fn+↑</strong> = Page Up
							</li>
							<li>
								<strong>fn+↓</strong> = Page Down
							</li>
							<li>
								<strong>fn+←</strong> = Home
							</li>
							<li>
								<strong>fn+→</strong> = End
							</li>
							<li>
								<strong>fn+Del</strong> = Forward Delete
							</li>
						</ul>
					</div>
				</div>

				<h2>File Handling</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+S</span>
						</td>
						<td>Save current file</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+O</span>
						</td>
						<td>Offer to write file ("Save as")</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+R</span>
						</td>
						<td>Insert a file into current one</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+X</span>
						</td>
						<td>Close buffer, exit from nano</td>
					</tr>
				</table>

				<h2>Editing</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+K</span>
						</td>
						<td>Cut current line into cutbuffer</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+6</span>
						</td>
						<td>Copy current line into cutbuffer</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+U</span>
						</td>
						<td>Paste contents of cutbuffer</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+]</span>
						</td>
						<td>Complete current word</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+3</span>
						</td>
						<td>Comment/uncomment line/region</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+U</span>
						</td>
						<td>Undo last action</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+E</span>
						</td>
						<td>Redo last undone action</td>
					</tr>
				</table>

				<h2>Search and Replace</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+B</span>
						</td>
						<td>Start backward search</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+F</span>
						</td>
						<td>Start forward search</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+B</span>
						</td>
						<td>Find next occurrence backward</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+F</span>
						</td>
						<td>Find next occurrence forward</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+R</span>
						</td>
						<td>Start a replacing session</td>
					</tr>
				</table>

				<h2>Deletion</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+H</span>
						</td>
						<td>Delete character before cursor</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+D</span>
						</td>
						<td>Delete character under cursor</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+Del</span>
						</td>
						<td>Delete word to the left</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+fn+Del</span>
						</td>
						<td>Delete word to the right</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+fn+Del</span>
						</td>
						<td>Delete current line</td>
					</tr>
				</table>

				<h2>Operations</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+T</span>
						</td>
						<td>Execute some command</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+T Ctrl+S</span>
						</td>
						<td>Run a spell check</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+T Ctrl+Y</span>
						</td>
						<td>Run a syntax check</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+T Ctrl+O</span>
						</td>
						<td>Run a formatter</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Tab</span>
						</td>
						<td>Indent marked region</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Shift+Tab</span>
						</td>
						<td>Unindent marked region</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+J</span>
						</td>
						<td>Justify paragraph or region</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+J</span>
						</td>
						<td>Justify entire buffer</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+T</span>
						</td>
						<td>Cut until end of buffer</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+:</span>
						</td>
						<td>Start/stop recording of macro</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+;</span>
						</td>
						<td>Replay macro</td>
					</tr>
				</table>

				<h2>Moving Around</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">←</span>
						</td>
						<td>One character backward</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">→</span>
						</td>
						<td>One character forward</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+←</span>
						</td>
						<td>One word backward</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+→</span>
						</td>
						<td>One word forward</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+A</span>
						</td>
						<td>To start of line</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+E</span>
						</td>
						<td>To end of line</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+P</span>
						</td>
						<td>One line up</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+N</span>
						</td>
						<td>One line down</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+↑</span>
						</td>
						<td>To previous block</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+↓</span>
						</td>
						<td>To next block</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+fn+←</span>
						</td>
						<td>To first row in viewport</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+fn+→</span>
						</td>
						<td>To last row in viewport</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+Y</span> or{" "}
							<span className="keystroke">fn+↑</span>
						</td>
						<td>One page up</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+V</span> or{" "}
							<span className="keystroke">fn+↓</span>
						</td>
						<td>One page down</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+\</span>
						</td>
						<td>To top of buffer</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+/</span>
						</td>
						<td>To end of buffer</td>
					</tr>
				</table>

				<h2>Special Movement</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+G</span>
						</td>
						<td>Go to specified line</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+]</span>
						</td>
						<td>Go to complementary bracket</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+↑</span>
						</td>
						<td>Scroll viewport up</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+↓</span>
						</td>
						<td>Scroll viewport down</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+&lt;</span>
						</td>
						<td>Switch to preceding buffer</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+&gt;</span>
						</td>
						<td>Switch to succeeding buffer</td>
					</tr>
				</table>

				<h2>Information</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+C</span>
						</td>
						<td>Report cursor position</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+D</span>
						</td>
						<td>Report line/word/character counts</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+G</span>
						</td>
						<td>Display help text</td>
					</tr>
				</table>

				<h2>Various</h2>
				<table>
					<tr>
						<th>Keystroke</th>
						<th>Function</th>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+A</span>
						</td>
						<td>Set or unset the mark</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+V</span>
						</td>
						<td>Enter next keystroke verbatim</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+C</span>
						</td>
						<td>Turn constant position info on/off</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+N</span>
						</td>
						<td>Turn line numbers on/off</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+P</span>
						</td>
						<td>Turn visible whitespace on/off</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+S</span>
						</td>
						<td>Turn softwrapping on/off</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+X</span>
						</td>
						<td>Hide/unhide the help lines</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Opt+Z</span>
						</td>
						<td>Hide/unhide the info bars</td>
					</tr>
					<tr>
						<td>
							<span className="keystroke">Ctrl+L</span>
						</td>
						<td>Refresh the screen</td>
					</tr>
				</table>
			</React.Fragment>
		),
	};
}

const myArticles = [article_1, article_2];

export default myArticles;

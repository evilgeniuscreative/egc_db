import React from "react";

const title =
	"An Open Letter to Mr. Tim Cook, Mr. Sundar Pichai, and Mr. Philip D. Moyer";
const image = "YouTubeOpenLetterChildSafety.jpg";
const imageAlt =
	"Why won't YouTube / Google block channels and keywords at childrens' expense? Hint: It's about money.";
function article_1() {
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
								src={`/server_assets/images/${image}`}
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

// function article_2() {
// 	return {
// 		date: "7 May 2023",
// 		title: "Artificial Intelligence in Healthcare",
// 		description:
// 			"AI is transforming the healthcare industry, from improving patient outcomes to streamlining operations. Discover the latest applications of this game-changing technology.",
// 		style: ``,
// 		keywords: [
// 			"Artificial Intelligence in Healthcare",
// 			"Tharindu",
// 			"Tharindu N",
// 			"Tharindu Nayanajith",
// 		],
// 		body: (
// 			<React.Fragment>
// 				<h1>Content of article 2</h1>
// 			</React.Fragment>
// 		),
// 	};
// }

const myArticles = [article_1];

export default myArticles;

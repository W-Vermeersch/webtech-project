// Backend URLS

// delete controller:
export const DELETE_USER = "/db/delete/user/delete-user"; // een user deleten. heeft username in de request parameters nodig. (req.param.username)
export const DELETE_LIKE = "/db/delete/user/delete-like"; // delete een like tussen een user en post. heeft username en post_id nodig in de parameters (req.param.username en .post_id)
export const DELETE_COMMENT = "/db/delete/comment/delete"; // delete een comment. heeft de comment id nodig in de parameters (req.params.comment_id)
export const DELETE_POST = "/db/delete/post/delete"; // delete een post. heeft de post id nodig in de parameters (req.params.post_id)

// fetch controllers:
//fetchUserInformation, hebben allemaal username nodig (req.params.username)
export const FETCH_USER_PROFILE = "/db/fetch/user/profile"; // geeft de user profile terug,
export const FETCH_USER_COMMENTS = "/db/fetch/user/comments"; // geeft comments van de user terug
export const FETCH_USER_POSTS = "/db/fetch/user/posts"; // geeft posts van de user terug
export const FETCH_USER_LIKED = "/db/fetch/user/liked-posts"; // geeft alle posts terug die de user heeft geliked
export const FETCH_HAS_USER_LIKED = "/db/fetch/post/liked"; //geeft als response a json {liked: boolean}

export const SEARCH_USER = "/db/fetch/search/user"; // geeft alle users terug die een bepaalde string in hun username hebben. heeft search in de parameters nodig (req.params.username)
export const SEARCH_TAG = "/db/fetch/search/tag"; // geeft alle posts terug die een bepaalde tag hebben. heeft search in de parameters nodig (req.params.tag, longitude, latitude, radius, filter_enabled)
export const SEARCH_TAG_FOLLOWING = "db/fetch/search/tag-and-followers" // axios private, params: latitude, longitude, radius, tags, filter_enabled


//FetchCommentInformation, heeft comment_id nodig in de parameters (req.params.comment_id)
export const FETCH_COMMENT = "/db/fetch/comment/information"; // geeft alle values van een comment terug, user, description en post

//FetchPostInformation (heeft post id nodig in parameters (req.params.post_id)
export const FETCH_POST = "db/fetch/post/information"; // geeft alle values van een post terug.
export const FETCH_POST_LIKED = "db/fetch/post/liked"; // geeft als een user een post heeft geliked of niet
export const FETCH_POST_COMMENTS = "db/fetch/post/comments"; // geeft alle comments van een post terug
export const FETCH_RANDOM_POSTS = "db/fetch/post/random-posts"; // geeft random posts terug (params: nr_of_posts)
export const FETCH_POST_NEAREST = "db/fetch/post/nearest"; // heeft latitude, longitude en limit nodig in e params. die geeft limit aantal posts terug die het dischts zijn van de gegeven locatie. hier kan je niet de optie hebben om alle posts te tonen maar dat is van zelfsprekend
export const FETCH_POST_RADIUS = "db/fetch/post/within-radius"; // deze heeft latitude, longitude, radius en limit nodig in de params. als limit -1 is geeft het alle posts terug binnenin de radius. als het niet -1 is gaat het limit aantal posts terug geven.
export const FETCH_LEADERBOARD_EXP = "db/fetch/leaderboard-exp";

// follow
export const FOLLOW = "db/store/user/follow"; // axios private, params: username (to follow)
export const UNFOLLOW = "db/delete/user/unfollow"; // axios private, params: username (to unfollow)
export const FETCH_FOLLOWERS = "db/fetch/user/followers"; //optional auth header, params: username
export const FETCH_FOLLOWING = "db/fetch/user/following"; //optional auth header, params: username
export const FETCH_FOLLOWER_AMOUNT = "db/fetch/user/follower-amount"; // params: username
export const FETCH_FOLLOWING_AMOUNT = "db/fetch/user/followed-amount" ; // params: username 
export const FETCH_IS_FOLLOWING = "db/fetch/user/is-following"; // params: username
export const FETCH_RANDOM_FOLLOW_POSTS = "db/fetch/post/get-random-follower-posts"; // axios private, params: nr_of_posts
export const FETCH_LEADERBOARD_FOLLOWERS = "db/fetch/leaderboard-followers"

//Storing controllers:
//StoreUserInformation
export const LIKE_POST = "/db/store/user/like-post"; // een user liked een post (als die nog niet geliked werd, als wel stuurd het een 404 error terug) heeft een username en post_id nodig in de parameters.
export const FOLLOW_USER = "/db/store/user/follow-user"; // een user volgt iemand. deze doet nog niets omdat we nog geen follower table hebben.
export const UPDATE_BIO = "/db/store/user/update-bio"; // de bio van een user aanpassen. heeft username en nieuwe bio nodig in de parameters (req.params.new_bio)
export const UPDATE_PFP = "/db/store/user/update-profile-picture"; // pas je pfp aan. heeft username en new_profile_picture nodig in de parameters
export const UPDATE_DN = "/db/store/user/update-displayname"; // idem met displayname. heeft username en new_display_name nodig in parameters.

// StoreCommentInformation
export const ADD_COMMENT = "/db/store/comment"; // een comment opslaan. deze werkt zoals de sign in en log in controllers. dus de waarden die je moet sturen moet je in de body zetten. die zullen dan in een form gezet worden, gecheckt en als alles oke is opgeslaan. als er errors zijn worden die terug gestuurd zoals sign in of log in zouden doen.

// StorePostInformation
export const ADD_POST = "/db/store/post"; // een post opslaan. dit is de code van william die ik hierin heb verplaatst. ik weet nog niet exact wat en hoe er meegegeven moet worden. dit is nog in work in progress

// User Authentication controllers:
export const SIGN_IN = "/user/sign-in"; // een user aanmaken. heeft username, email, password en passwordConfirm nodig in de body
export const LOG_IN = "/user/log-in"; // een user inloggen. heeft username of email en password nodig in de body
export const LOG_OUT = "/user/log-out"; // een user uitloggen. heeft geen parameters nodig
export const REFRESH_TOKEN = "/user/token"; // een nieuwe access token aanvragen. heeft geen parameters nodig

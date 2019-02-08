var AV = require('leanengine');
AV.Cloud.beforeSave('Enrollment', function (request) {
    request.object.set('user', request.currentUser);
});
AV.Cloud.beforeDelete('_User', function (request) {
    let enrollmentQuery = new AV.Query('Enrollment');
    enrollmentQuery.equalTo('user', request.object);
    enrollmentQuery.limit(1000);
    enrollmentQuery.find().then(function (enrollments) {
        for (let enrollment of enrollments) {
            enrollment.destroy();
        }
    });
});
AV.Cloud.define('getUserCount', function (request) {
    let userQuery = new AV.Query('_User');
    return userQuery.count().then(function (count) {
        return count;
    });
});
AV.Cloud.define('getQuote', function (request) {
    let quotes = [
        {
            'content': 'A dream doesn’t become reality through magic; it takes sweat, determination and hard work.',
            'author': 'Colin Powell'
        },
        {
            'content': 'Believe you can and you’re halfway there.',
            'author': 'Theodore Roosevelt'
        },
        {
            'content': 'Change your life today. Don’t gamble on the future, act now, without delay.',
            'author': 'Simone de Beauvoir'
        },
        {
            'content': 'Everything has beauty, but not everyone sees it.',
            'author': 'Confucius'
        },
        {
            'content': 'He who knows all the answers has not been asked all the questions.',
            'author': 'Confucius'
        },
        {
            'content': 'Humility is the solid foundation of all virtues.',
            'author': 'Confucius'
        },
        {
            'content': 'If you can dream it, you can do it.',
            'author': 'Walt Disney'
        },
        {
            'content': 'If you do something and it turns out pretty good, then you should go do something else wonderful, not dwell on it for too long. Just figure out what’s next.',
            'author': 'Steve Jobs'
        },
        {
            'content': 'It always seems impossible until it’s done.',
            'author': 'Nelson Mandela'
        },
        {
            'content': 'It does not matter how slowly you go as long as you do not stop.',
            'author': 'Confucius'
        },
        {
            'content': 'It is during our darkest moments that we must focus to see the light.',
            'author': 'Aristotle'
        },
        {
            'content': 'Life is full of happiness and tears; be strong and have faith.',
            'author': 'Kareena Kapoor Khan'
        },
        {
            'content': 'Life is what happens to us while we are making other plans.',
            'author': 'Allen Saunders'
        },
        {
            'content': 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
            'author': 'Mahatma Gandhi'
        },
        {
            'content': 'Logic will get you from A to Z; imagination will get you everywhere.',
            'author': 'Albert Einstein'
        },
        {
            'content': 'Most people fail in life not because they aim too high and miss, but because they aim too low and hit.',
            'author': 'Les Brown'
        },
        {
            'content': 'Other people’s opinion of you does not have to become your reality.',
            'author': 'Les Brown'
        },
        {
            'content': 'Sometimes the questions are complicated and the answers are simple.',
            'author': 'Dr. Seuss'
        },
        {
            'content': 'The best preparation for tomorrow is doing your best today.',
            'author': 'H. Jackson Brown, Jr.'
        },
        {
            'content': 'The secret of getting ahead is getting started.',
            'author': 'Mark Twain'
        },
        {
            'content': 'There are no shortcuts to any place worth going.',
            'author': 'Beverly Sills'
        },
        {
            'content': 'There is only one heroism in the world: to see the world as it is, and to love it.',
            'author': 'Romain Rolland'
        },
        {
            'content': 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.',
            'author': 'Ralph Waldo Emerson'
        },
        {
            'content': 'We must accept finite disappointment, but never lose infinite hope.',
            'author': 'Martin Luther King, Jr.'
        },
        {
            'content': 'What you do today can improve all your tomorrows.',
            'author': 'Ralph Marston'
        },
        {
            'content': 'You may be disappointed if you fail, but you are doomed if you don’t try.',
            'author': 'Beverly Sills'
        },
        {
            'content': 'You will never win if you never begin.',
            'author': 'Helen Rowland'
        }
    ];
    return quotes[Math.floor(quotes.length * Math.random())];
});
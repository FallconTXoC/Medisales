let opendd;
let newNotifications = [];
let oldNotifications = [];
let awaitingNotifications = 0;
let all_notif_count;
const uniqueId = (length=16) => {
    return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
}
const socket = io();
const dropdown_footer = `
    <div class="dropdown-footer" id="dropdown-footer">
        <span>TOUT SUPPRIMER</span>
    </div>
`;

const initBell = function(){
    newNotifications = JSON.parse(localStorage.getItem('newNotifications')) ?? newNotifications;
    awaitingNotifications = JSON.parse(localStorage.getItem('awaitingNotifications')) ?? awaitingNotifications;

    $.post('/api/getNotifications')
    .done(function(response) {
        let latestNotif = localStorage.getItem('latestNotif')
        response.forEach(notification => {
            if(latestNotif != "undefined") {
                if(new Date(notification.notif_time) > new Date(JSON.parse(latestNotif))) {
                    newNotifications.push(notification);
                    awaitingNotifications++
                    localStorage.setItem('awaitingNotifications', JSON.stringify(awaitingNotifications));
                    localStorage.setItem('newNotifications', JSON.stringify(newNotifications));
                } else {
                    oldNotifications.push(notification);
                    localStorage.setItem('oldNotifications', JSON.stringify(oldNotifications));
                }
            } else {
                newNotifications.push(notification);
                awaitingNotifications++
                localStorage.setItem('awaitingNotifications', JSON.stringify(awaitingNotifications));
                localStorage.setItem('newNotifications', JSON.stringify(newNotifications));
            }
        })
    })
    .fail(function(xhr, status, err) {
        oldNotifications = JSON.parse(localStorage.getItem('oldNotifications')) ?? oldNotifications; 
    })
    .always(function() {
        oldNotifications.sort((a,b)=>new Date(a.notif_time).getTime() - new Date(b.notif_time).getTime());
        newNotifications.sort((a,b)=>new Date(a.notif_time).getTime() - new Date(b.notif_time).getTime());

        oldNotifications.forEach(notification => {
            let newNotif = `
                <div class="bellnotification old" id=${notification.id_notif}>
                    <div class="notification-image-wrapper noselect">
                        <div class="notification-image">
                            <span class="material-icons-outlined">
                                done
                            </span>
                        </div>
                    </div>
                    <div class="notification-text">
                        <span class="highlight">${notification.action_target}</span>
                        ${notification.notif_action}
                    </div>
                    <div class="notification-cross noselect" notif-id=${notification.id_notif}>
                        <span class="material-icons-outlined">clear</span>
                    </div>
                </div>
            `
            $('.dropdown-body').prepend(newNotif);
        })

        newNotifications.forEach(notification => {
            let newNotif = `
                <div class="bellnotification new" id=${notification.id_notif}>
                    <div class="notification-image-wrapper noselect">
                        <div class="notification-image">
                            <span class="material-icons-outlined">
                                done
                            </span>
                        </div>
                    </div>
                    <div class="notification-text">
                        <span class="highlight">${notification.action_target}</span>
                        ${notification.notif_action}
                    </div>
                    <div class="notification-cross noselect" notif-id=${notification.id_notif}>
                        <span class="material-icons-outlined">clear</span>
                    </div>
                </div>
            `
            $('.dropdown-body').prepend(newNotif)
        })

        $('#notification-dropdown').append(dropdown_footer);
        if(oldNotifications.length === 0 && newNotifications.length === 0) $('.dropdown-footer').addClass('hide');
        document.getElementById("dropdown-footer").addEventListener("click", () => removeAllNotifications())

        if(awaitingNotifications > 0) {
            let latest_notifdate = (newNotifications.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b))).notif_time;
            localStorage.setItem('latestNotif', JSON.stringify(latest_notifdate))

            if(!($('#notification-dropdown').css('display') === "block")) $('#notifications-count').removeClass('fadeOut').addClass('fadeIn');
        }

        if(awaitingNotifications > 99) notifcount = "99+"
        else notifcount = awaitingNotifications
        document.getElementById('notifications-count').innerHTML = notifcount;
        
        let all_notif_text;
        all_notif_count = newNotifications.length + oldNotifications.length;
        if(all_notif_count > 99) all_notif_text = "99+"
        else all_notif_text = all_notif_count;
        document.getElementById('dd-notifications-count').innerHTML = all_notif_text;

        const notif_crosses = document.querySelectorAll('.notification-cross');
        notif_crosses.forEach(notif_cross => {
            notif_cross.addEventListener('click', () => removeNotifications(notif_cross))
        })
    })
}

const showNotifications = function($event){
    if($event.target.className.includes('controldropdown')) {
        let targetdd = $($event.target).closest('.belldropdown-container').find('.dropdown-menu');
        opendd = targetdd;
        if(targetdd.hasClass('fadeInDown')){
            hidedd(targetdd);
        }
        else{
            targetdd.css('display', 'block').removeClass('fadeOutUp').addClass('fadeInDown')
            .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(){
                $(this).show();
            });
            targetdd.find('.dropdown-body')[0].scrollTop = 0;
            awaitingNotifications = 0;
            if($('#notifications-count').hasClass('fadeIn')) $('#notifications-count').removeClass('fadeIn').addClass('fadeOut');

            setTimeout(function () { $(`.bellnotification.new:not([read])`).addClass('read') }, 400);
        }
    }
};

//Hide dropdown function
const hidedd = function(targetdd){
    targetdd.removeClass('fadeInDown').addClass('fadeOutUp')
    .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function(){
        $(this).hide();
    });
    opendd = null;
    awaitingNotifications = 0;
    newNotifications = [];
    localStorage.setItem('newNotifications', JSON.stringify(newNotifications));
    localStorage.setItem('awaitingNotifications', JSON.stringify(awaitingNotifications));
    if(awaitingNotifications > 0)
        $('#notifications-count').removeClass('fadeOut').addClass('fadeIn');
}

window.onclick = function(event){
    let clickedElement = $(event.target);
    let clickedDdTrigger = clickedElement.closest('.dd-trigger').length;
    let clickedDdContainer = clickedElement.closest('.dropdown-menu').length;
    if(opendd != null && clickedDdTrigger == 0 && clickedDdContainer == 0){
        hidedd(opendd);
    }
}

window.onbeforeunload = function(e) {
    if(opendd != null){
    hidedd(opendd); 
}
};

$(document).ready(function() {
    initBell()
})

socket.on("newNotif", function (data) {
    let new_notif = data;
    $.post(`/api/isNotificationTarget`, {notifTarget: new_notif.target, notif_type: new_notif.notif_type})
    .done(function (data) {
        if(data.is_target === true) {
            newNotifications.push(new_notif);
            awaitingNotifications++;
            localStorage.setItem('newNotifications', JSON.stringify(newNotifications));
            localStorage.setItem('awaitingNotifications', JSON.stringify(awaitingNotifications));
            localStorage.setItem('latestNotif', JSON.stringify(new Date(new_notif.notif_time).toUTCString()))
        
            if(awaitingNotifications > 0 && !($('#notification-dropdown').css('display') === "block")) {
                $('#notifications-count').removeClass('fadeOut').addClass('fadeIn');
            }
            if(awaitingNotifications > 99) notifcount = "99+"
            else notifcount = awaitingNotifications
            document.getElementById('notifications-count').innerHTML = notifcount;

            all_notif_count++

            let all_notif_text;
            if(all_notif_count > 99) all_notif_text = "99+"
            else all_notif_text = all_notif_count;
            document.getElementById('dd-notifications-count').innerHTML = all_notif_text;
            
            let uid = uniqueId();
            let newNotif = `
                    <div class="bellnotification new" id=${new_notif.id_notif}>
                    <div class="notification-image-wrapper noselect">
                        <div class="notification-image">
                            <span class="material-icons-outlined">
                                done
                            </span>
                        </div>
                    </div>
                    <div class="notification-text">
                        <span class="highlight">${new_notif.action_target}</span>
                        ${new_notif.notif_action}
                    </div>
                    <div class="notification-cross noselect" id="a${new_notif.id_notif}" notif-id="${new_notif.id_notif}">
                        <span class="material-icons-outlined">clear</span>
                    </div>
                </div>
            ` 
            $('.dropdown-body').prepend(newNotif)

            const notif_cross = document.getElementById(`a${new_notif.id_notif}`);
            notif_cross.addEventListener('click', () => removeNotifications(notif_cross))

            $('.dropdown-footer').removeClass('hide');
        
            if($('#notification-dropdown').css('display') === "block") {
                setTimeout(function () {
                    if($('#notification-dropdown').css('display') === "block") {
                        $(`#${uid}`).addClass('read')
                    }
                }, 400);
            }
        } 
    })
})

function removeNotifications(notif_cross) {
    const id_notif = notif_cross.getAttribute('notif-id');
    oldNotifications.splice(oldNotifications.findIndex(function(i){ return i.id_notif === id_notif; }), 1);
    localStorage.setItem('oldNotifications', JSON.stringify(oldNotifications));

    all_notif_count--
    let all_notif_text;
    if(all_notif_count > 99) all_notif_text = "99+"
    else all_notif_text = all_notif_count;
    document.getElementById('dd-notifications-count').innerHTML = all_notif_text;

    $.post(`/api/dismissNotification`, {id_notif: id_notif})
    .done(() => {
        document.getElementById(id_notif).remove();
        if(all_notif_count === 0) $('.dropdown-footer').addClass('hide');
    })
}

async function removeAllNotifications() {
    const notifications = document.querySelectorAll('.bellnotification');

    let removeNotif = new Promise((resolve, reject) => {
        notifications.forEach((notification, index, array) => {
            $.post(`/api/dismissNotification`, {id_notif: notification.id})
            .done(() => {
                notification.remove();
                if(index === array.length -1) resolve();
            })
        })
    })

    removeNotif.then(() => {
        $('.dropdown-footer').addClass('hide');
        all_notif_count = 0;
        document.getElementById('dd-notifications-count').innerHTML = all_notif_count;
    })
}
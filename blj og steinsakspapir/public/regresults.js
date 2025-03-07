const btnPlay = document.getElementById('btnPlay');
const resForm = document.getElementById('frmResult');

btnPlay.addEventListener('click', () => {

    const result = Math.round(Math.random())
    if (result === 0) {
        alert('Du vant!');
    } else {
        alert('Du tapte!');
    }
    resForm.getElementById('frmResult').value = result;
    resForm.submit();
});
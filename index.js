var fs = require('fs')
function Model (fields, dbPath) {
    this.fields = fields
    this.dbPath = dbPath
    var fs = require('fs');
    var defaultBase = {
        "items": [],
        "count": 0
    }

    if (fs.existsSync(this.dbPath)) {
            var base = JSON.parse(fs.readFileSync(this.dbPath, 'UTF-8'))
    } else {
            var base = defaultBase
    }

    this.rows = base.items
    this.count = base.count

    this.save = () => {
        var base = {items: this.rows, count: this.count}
        fs.writeFileSync(this.dbPath, JSON.stringify(base))
    }

    this.makeId = () => {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }        

    this.insert = (o) => {
        this.count = this.count + 1

        var id = this.makeId()

        var r = {_id: id}
        for (f in this.fields) {
            r[f] = o[f]
        }

        this.rows.push(r)
        this.save()
        return r
    }

    this.findOne = (n, v, b) => {
        var res = []
        b.forEach((row)=>{
            if (this.fields[n] == 'number') {
                if (row[n] == v) {
                    res.push(row)
                }  
            } else if (this.fields[n] == 'string') {
                if (row[n].toLowerCase() == v.toLowerCase()) {
                    res.push(row)
                }  
            }
        })

        return res
    }         

    this.get = (id) =>{
        var r = false
        this.rows.forEach((item)=>{
            if (!r && item._id == id) 
                r = item
        })
        
        return r
    }

    this.find = (o) =>{
        var b = this.rows

        for (i in o) {
            r = this.findOne(i, o[i], b)
        }
        if (r.length > 0) {
                return r
        } else 
            return false
    }

    this.delete = (o) =>{
        var r = this.find(o)
        r.forEach((item)=>{
            var index = this.rows.indexOf(item);
            if (index > -1) {
                this.rows.splice(index, 1);
            }
        })

        this.save()
    }
}

function Db (models, p = false) {
    this.p = {
        dbPath: __dirname,
        modelPath: __dirname
    }

    if (p) {
        for(i in p) {
            this.p[i] = p[i]
        }
    }
    this.models = []
    models.forEach((m)=>{
        var name = m.name
        this.models[name] = new Model(m, this.p)
        this[name] = this.models[name]
    }) 
}

module.exports = Model
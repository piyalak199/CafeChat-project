class User {
    constructor({
      userId,
      username,
      displayName,
      coin,
      pettypeID,
      petName,
      petImg,
      roleID,
      roleName,
    }) {
      this.userId = userId;
      this.username = username;
      this.displayName = displayName;
      this.coin = coin;
      this.pettypeID = pettypeID;
      this.petName = petName;
      this.petImg = petImg;
      this.roleID = roleID;
      this.roleName = roleName;
    }
  
    static fromJSON(json) {
      return new User({
        userId: json.userId,
        username: json.username,
        displayName: json.displayName,
        coin: json.coin,
        pettypeID: json.pettypeID,
        petName: json.petName,
        petImg: json.petImg,
        roleID: json.roleID,
        roleName: json.roleName,
        
      });
    }
  }
  